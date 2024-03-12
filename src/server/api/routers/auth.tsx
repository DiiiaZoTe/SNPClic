// NOTE: TRPC cannot set cookies or redirect,
//       therefore this router only includes logic
//       that does not require cookies or redirects.

import { z } from "zod";

import { logError } from "@/lib/utilities/logger";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  emailVerificationCode,
  passwordResetToken,
  user,
} from "@/server/db/schema";

import { Scrypt, generateId } from "lucia";
import { lucia } from "@/server/auth";

import { cookies } from "next/headers";

import { redirects } from "@/lib/auth/redirects";
import {
  generateEmailVerificationCode,
  generatePasswordResetToken,
  getAndDeletePasswordResetToken,
  insertNewAccountWithTemporaryPassword,
  timeFromNow,
} from "@/server/auth/utilities";

import { sendEmail } from "@/server/emails/send";
import VerificationCodeEmail from "@/../emails/email-verification";
import { isWithinExpirationDate } from "oslo";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/config/site";
import ResetPasswordEmail from "emails/reset-password";
import {
  changePasswordServerSchema,
  emailSchema,
  resetPasswordServerSchema,
} from "@/lib/auth/schemas";
import {
  deleteUserByEmail,
  getUserByEmail,
  updateUserPassword,
} from "@/server/db/queries/auth";
import EmailAccountCreatedTempPass from "emails/account-created-temp";
import { api } from "@/trpc/server";

export const authRouter = createTRPCRouter({
  changePassword: protectedProcedure
    .input(changePasswordServerSchema)
    .mutation(async ({ ctx, input }) => {
      const selectUser = await ctx.db.query.user.findFirst({
        where: (table, { eq }) => eq(table.id, ctx.user.id),
        columns: { hashedPassword: true },
      });
      if (!selectUser?.hashedPassword) {
        logError({
          request: ctx.headers,
          error: `Failed to find user`,
          location: `/api/trpc/auth.changePassword`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Une erreur est survenue lors du changement de votre mot de passe.`,
        });
      }
      const currentHashed = selectUser.hashedPassword;
      const validPassword = await new Scrypt().verify(
        currentHashed,
        input.currentPassword
      );
      if (!validPassword) {
        logError({
          request: ctx.headers,
          error: `Invalid current password`,
          location: `/api/trpc/auth.changePassword`,
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `Mot de passe actuel invalide.`,
        });
      }
      const newHashed = await new Scrypt().hash(input.newPassword);
      const updateUser = await updateUserPassword({
        userId: ctx.user.id,
        newHashedPassword: newHashed,
      });
      if (!updateUser) {
        logError({
          request: ctx.headers,
          error: `Failed updating user password`,
          location: `/api/trpc/auth.changePassword`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Une erreur est survenue lors du changement de votre mot de passe.`,
        });
      }
      return { success: true, message: "Mot de passe changé." };
    }),

  deleteUserByEmail: adminProcedure
    .input(
      z.object({
        email: z
          .string()
          .email("Veuillez fournir une adresse e-mail valide.")
          .min(1, "Veuillez fournir un e-mail valide."),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      const deleteUser = await deleteUserByEmail({ email });
      if (deleteUser.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            deleteUser.error ??
            "Une erreur est survenue lors de la suppression.",
        });
      }
      return {
        success: true,
        email,
      };
    }),

  createNewUserAccount: adminProcedure
    .input(emailSchema)
    .mutation(async ({ input }) => {
      const newUser = await insertNewAccountWithTemporaryPassword(input.email);
      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Une erreur est survenue lors de la création du compte.`,
        });
      }

      try {
        await sendEmail({
          to: input.email,
          subject: "Compte SNPClic créé",
          react: (
            <EmailAccountCreatedTempPass password={newUser.temporaryPassword} />
          ),
        });
      } catch (error) {
        logError({
          error: "Failed sending account created email",
          location: "createNewUserAccount",
          otherData: { error },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Le compte a été créé, mais une erreur est survenue lors de l'envoi de l'e-mail de confirmation. 
          Veuillez demander à l'utilisateur de changer son mot de passe temporaire via la page de connexion.`,
        });
      }
      return { success: true, email: input.email };
    }),

  forgotPassword: publicProcedure
    .input(emailSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const message =
        "Si un compte existe avec cette adresse e-mail, un e-mail de réinitialisation de mot de passe a été envoyé.";
      const user = await getUserByEmail({ email });
      if (!user) {
        return {
          message:
            "Si un compte existe avec cette adresse e-mail, un e-mail de réinitialisation de mot de passe a été envoyé.",
        };
      }
      const verificationToken = await generatePasswordResetToken(user.id);
      if (!verificationToken) {
        return { message };
      }
      const verificationLink = `${siteConfig.url}/reset-password/${verificationToken}`;
      try {
        await sendEmail({
          to: user.email,
          subject: "Réinitialiser votre mot de passe",
          react: <ResetPasswordEmail link={verificationLink} />,
        });
      } catch (error) {
        logError({
          request: ctx.headers,
          error: "Failed sending password reset email",
          location: "forgotPassword",
          otherData: { error },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Nous recontrons des difficultés d'envoie d'e-mail. Veuillez réessayer plus tard.`,
        });
      }
      return { success: true, message };
    }),

  resetPassword: publicProcedure
    .input(resetPasswordServerSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, newPassword } = input;
      const message = `Lien de réinitialisation de mot de passe non valide ou expiré.`;

      const resultDBToken = await getAndDeletePasswordResetToken(token);
      if (!resultDBToken.success) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message,
        });
      }
      const dbToken = resultDBToken.data;

      const isNotExpired =
        dbToken && !isWithinExpirationDate(dbToken.expiresAt);
      if (!dbToken || isNotExpired) {
        logError({
          request: ctx.headers,
          error: !dbToken
            ? `Invalid password reset token`
            : isNotExpired
            ? `Password reset link expired`
            : `Unknown password reset error`,
          location: `/api/trpc/auth.resetPassword`,
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message,
        });
      }
      try {
        await lucia.invalidateUserSessions(dbToken.userId);
      } catch (error) {
        logError({
          request: ctx.headers,
          error: "Failed invalidating user sessions",
          location: `/api/trpc/auth.resetPassword`,
          otherData: { error },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Une erreur est survenue lors de la réinitialisation de votre mot de passe.`,
        });
      }

      const newHashed = await new Scrypt().hash(input.newPassword);
      const updateUser = await updateUserPassword({
        userId: dbToken.userId,
        newHashedPassword: newHashed,
      });
      if (!updateUser) {
        logError({
          request: ctx.headers,
          error: `Failed updating user password`,
          location: `/api/trpc/auth.resetPassword`,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Une erreur est survenue lors du changement de votre mot de passe.`,
        });
      }
      return { success: true, message: "Mot de passe changé." };
    }),

  // signup: publicProcedure
  //   .input(
  //     z.object({
  //       email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  //       password: z
  //         .string()
  //         .min(1, "Veuillez entrer un mot de passe.")
  //         .max(255),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const existingUser = await ctx.db.query.user.findFirst({
  //       where: (table, { eq }) => eq(table.email, input.email),
  //       columns: { email: true },
  //     });

  //     if (existingUser) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Sign up fail, account ${input.email} already exists`,
  //         location: `/api/trpc/auth.signup`,
  //       });
  //       throw new TRPCError({
  //         code: "CONFLICT",
  //         message: `Ce compte existe déjà.`,
  //       });
  //     }

  //     const userId = generateId(21);
  //     const hashedPassword = await new Scrypt().hash(input.password);
  //     const [insertNewUser] = await ctx.db.insert(user).values({
  //       id: userId,
  //       email: input.email,
  //       hashedPassword,
  //     });
  //     if (insertNewUser.affectedRows == 0) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Failed inserting new user`,
  //         location: `/api/trpc/auth.signup`,
  //       });
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: `Une erreur est survenue lors de la création de votre compte.`,
  //       });
  //     }

  //     const verificationCode = await generateEmailVerificationCode(
  //       userId,
  //       input.email
  //     );
  //     if (!verificationCode) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Failed generating verification code`,
  //         location: `/api/trpc/auth.signup`,
  //       });
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: `Une erreur est survenue lors de la création de votre compte.`,
  //       });
  //     }

  //     await sendEmail({
  //       to: input.email,
  //       subject: "Vérifiez votre adresse e-mail",
  //       react: <VerificationCodeEmail code={verificationCode} />,
  //     });

  //     const session = await lucia.createSession(userId, {});
  //     const sessionCookie = lucia.createSessionCookie(session.id);
  //     console.log(sessionCookie);
  //     cookies().set(
  //       sessionCookie.name,
  //       sessionCookie.value,
  //       sessionCookie.attributes
  //     );
  //     return { success: true, redirect: redirects.afterSignup };
  //   }),

  // resendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
  //   const user = ctx.user;
  //   const lastSent = await ctx.db.query.emailVerificationCode.findFirst({
  //     where: (table, { eq }) => eq(table.userId, user.id),
  //     columns: { expiresAt: true },
  //   });

  //   if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
  //     logError({
  //       request: ctx.headers,
  //       error: `Tried to resend verification email too soon`,
  //       location: `/api/trpc/auth.resendVerificationEmail`,
  //     });
  //     throw new TRPCError({
  //       code: "UNAUTHORIZED",
  //       message: `Veuillez attendre ${timeFromNow(
  //         lastSent.expiresAt
  //       )} avant de renvoyer un e-mail de vérification.`,
  //     });
  //   }
  //   const verificationCode = await generateEmailVerificationCode(
  //     user.id,
  //     user.email
  //   );
  //   if (!verificationCode) {
  //     logError({
  //       request: ctx.headers,
  //       error: `Failed generating verification code`,
  //       location: `/api/trpc/auth.resendVerificationEmail`,
  //     });
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: `Une erreur est survenue lors de l'envoi de l'e-mail de vérification.`,
  //     });
  //   }

  //   await sendEmail({
  //     to: user.email,
  //     subject: "Vérifiez votre adresse e-mail",
  //     react: <VerificationCodeEmail code={verificationCode} />,
  //   });

  //   return { success: true, message: "E-mail de vérification envoyé." };
  // }),

  // verifyEmail: protectedProcedure
  //   .input(
  //     z.object({
  //       code: z.string().min(1, "Veuillez entrer un code."),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const ctxUser = ctx.user;
  //     const dbCode = await ctx.db.transaction(async (tx) => {
  //       const item = await tx.query.emailVerificationCode.findFirst({
  //         where: (table, { eq }) => eq(table.userId, ctxUser.id),
  //       });
  //       if (item) {
  //         await tx
  //           .delete(emailVerificationCode)
  //           .where(eq(emailVerificationCode.id, item.id));
  //       }
  //       return item;
  //     });

  //     const invalidCode = !dbCode || dbCode.code !== input.code;
  //     const emailMismatch = dbCode && dbCode.email !== ctxUser.email;
  //     const expiredCode = dbCode && !isWithinExpirationDate(dbCode.expiresAt);

  //     if (invalidCode || emailMismatch || expiredCode) {
  //       logError({
  //         request: ctx.headers,
  //         error: invalidCode
  //           ? `Invalid verification code`
  //           : emailMismatch
  //           ? `Verification code email mismatch`
  //           : expiredCode
  //           ? `Verification code expired`
  //           : `Unknown verification error`,
  //       });
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: `Code de vérification invalide.`,
  //       });
  //     }

  //     await lucia.invalidateUserSessions(ctxUser.id);
  //     const [updateUser] = await ctx.db
  //       .update(user)
  //       .set({ emailVerified: true })
  //       .where(eq(user.id, user.id));
  //     if (!updateUser.affectedRows) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Failed updating user email verification status`,
  //         location: `/api/trpc/auth.verifyEmail`,
  //       });
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: `Une erreur est survenue lors de la vérification de votre adresse e-mail.`,
  //       });
  //     }
  //     const session = await lucia.createSession(ctxUser.id, {});
  //     const sessionCookie = lucia.createSessionCookie(session.id);
  //     cookies().set(
  //       sessionCookie.name,
  //       sessionCookie.value,
  //       sessionCookie.attributes
  //     );
  //     return { success: true, message: "Adresse e-mail vérifiée." };
  //   }),

  // sendPasswordResetLink: publicProcedure
  //   .input(
  //     z.object({
  //       email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const message =
  //       "Si un compte existe avec cette adresse e-mail, un e-mail de réinitialisation de mot de passe a été envoyé.";

  //     const user = await ctx.db.query.user.findFirst({
  //       where: (table, { eq }) => eq(table.email, input.email),
  //     });

  //     if (!user || !user.emailVerified) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Failed to send password reset link, user not found or email not verified`,
  //         location: `/api/trpc/auth.sendPasswordResetLink`,
  //       });
  //       return { message };
  //     }

  //     const verificationToken = await generatePasswordResetToken(user.id);
  //     if (!verificationToken) {
  //       logError({
  //         request: ctx.headers,
  //         error: `Failed to generate password reset token`,
  //         location: `/api/trpc/auth.sendPasswordResetLink`,
  //       });
  //       return { message };
  //     }

  //     const verificationLink = `${siteConfig.url}/reset-password/${verificationToken}`;

  //     await sendEmail({
  //       to: user.email,
  //       subject: "Réinitialiser votre mot de passe",
  //       react: <ResetPasswordEmail link={verificationLink} />,
  //     });

  //     return { success: true, message };
  //   }),

  // resetPassword: publicProcedure
  //   .input(
  //     z.object({
  //       token: z.string().min(1, "Token non valide."),
  //       password: z.string().min(8, "Mot de passe trop court.").max(255),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const dbToken = await ctx.db.transaction(async (tx) => {
  //       const item = await tx.query.passwordResetToken.findFirst({
  //         where: (table, { eq }) => eq(table.id, input.token),
  //       });
  //       if (item) {
  //         await tx
  //           .delete(passwordResetToken)
  //           .where(eq(passwordResetToken.id, item.id));
  //       }
  //       return item;
  //     });

  //     const isNotExpired =
  //       dbToken && !isWithinExpirationDate(dbToken.expiresAt);
  //     if (!dbToken || isNotExpired) {
  //       logError({
  //         request: ctx.headers,
  //         error: !dbToken
  //           ? `Invalid password reset token`
  //           : isNotExpired
  //           ? `Password reset link expired`
  //           : `Unknown password reset error`,
  //         location: `/api/trpc/auth.resetPassword`,
  //       });
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: `Lien de réinitialisation de mot de passe non valide.`,
  //       });
  //     }

  //     await lucia.invalidateUserSessions(dbToken.userId);
  //     const hashedPassword = await new Scrypt().hash(input.password);
  //     await ctx.db
  //       .update(user)
  //       .set({ hashedPassword })
  //       .where(eq(user.id, dbToken.userId));
  //     const session = await lucia.createSession(dbToken.userId, {});
  //     const sessionCookie = lucia.createSessionCookie(session.id);
  //     cookies().set(
  //       sessionCookie.name,
  //       sessionCookie.value,
  //       sessionCookie.attributes
  //     );
  //     return { success: true, message: "Mot de passe réinitialisé." };
  //   }),
});
