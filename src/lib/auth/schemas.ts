import { z } from "zod";

//* login
export const loginSchema =
  z.object({
    email: z.string().email("Entrez une adresse e-mail valide.")
      .min(1, "Entrez une adresse e-mail valide.")
      .max(255, "L'adresse e-mail ne peut pas dépasser 255 caractères."),
    password: z
      .string()
      .min(8, "Mot de passe trop court. Veuillez entrer un mot de passe de 8 caractères ou plus.")
      .max(255, "Mot de passe trop long. Veuillez entrer un mot de passe de 255 caractères ou moins."),
  });
export type LoginSchema = z.infer<typeof loginSchema>;

//* change password
export const changePasswordServerSchema = z.object({
  currentPassword: z.string()
    .min(1, "Veuillez entrer votre mot de passe actuel.")
    .max(255, "Mot de passe trop long. Veuillez entrer un mot de passe de 255 caractères ou moins."),
  newPassword: z.string()
    .min(8, "Mot de passe trop court. Veuillez entrer un mot de passe de 8 caractères ou plus.")
    .max(255, "Mot de passe trop long. Veuillez entrer un mot de passe de 255 caractères ou moins.")
});
export const changePasswordSchema = changePasswordServerSchema.extend({
  confirmNewPassword: z.string()
    .min(8, "Mot de passe trop court. Veuillez entrer un mot de passe de 8 caractères ou plus.")
    .max(255, "Mot de passe trop long. Veuillez entrer un mot de passe de 255 caractères ou moins."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les mots de passe doivent correspondre.",
  path: ["confirmNewPassword"],
});
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;


