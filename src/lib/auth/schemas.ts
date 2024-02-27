import { z } from "zod";


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



// export const emailForm = z.object({
//   email: z.string()
//     .email()
//     .min(1, { message: "Email cannot be empty." })
//     .max(255, { message: 'Password cannot exceed 255 characters.' }),
// });
// export type EmailForm = z.infer<typeof emailForm>;

// export const emailPasswordForm = emailForm.extend({
//   password: z.string()
//     .min(8, { message: 'Password must be at least 8 characters.' })
//     .max(255, { message: 'Password cannot exceed 255 characters.' }),
// });
// export type EmailPasswordForm = z.infer<typeof emailPasswordForm>;

// export const emailPasswordConfirmForm = emailForm.extend({
//   password: z.string(),
//   confirmPassword: z.string()
//     .min(8, { message: 'Password must be at least 8 characters.' })
//     .max(255, { message: 'Password cannot exceed 255 characters.' }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords must match.',
//   path: ['confirmPassword'],
// }).superRefine(({ password }, checkPassComplexity) => {
//   const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
//   const containsLowercase = (ch: string) => /[a-z]/.test(ch);
//   const containsSpecialChar = (ch: string) =>
//     /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
//   let countOfUpperCase = 0,
//     countOfLowerCase = 0,
//     countOfNumbers = 0,
//     countOfSpecialChar = 0;

//   for (let i = 0; i < password.length; i++) {
//     let ch = password.charAt(i);
//     if (!isNaN(+ch)) countOfNumbers++;
//     else if (containsUppercase(ch)) countOfUpperCase++;
//     else if (containsLowercase(ch)) countOfLowerCase++;
//     else if (containsSpecialChar(ch)) countOfSpecialChar++;
//   }

//   let errObj = {
//     upperCase: { pass: true, message: "Contains at least one uppercase character." },
//     lowerCase: { pass: true, message: "Contains at least one lowercase character." },
//     specialCh: { pass: true, message: "Contains at least one special character." },
//     totalNumber: { pass: true, message: "Contains at least one number." },
//     numberofChar: { pass: true, message: "Contains at least 8 characters." },
//   };

//   if (countOfLowerCase < 1)
//     errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
//   if (countOfNumbers < 1)
//     errObj = { ...errObj, totalNumber: { ...errObj.totalNumber, pass: false } };
//   if (countOfUpperCase < 1)
//     errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
//   if (countOfSpecialChar < 1)
//     errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
//   if (password.length < 8)
//     errObj = { ...errObj, numberofChar: { ...errObj.numberofChar, pass: false } };
//   if (password.length > 255)
//     errObj = { ...errObj, numberofChar: { message: "Password cannot contain more than 255 characters.", pass: false } };

//   if (
//     // if any of the above conditions are false
//     !errObj.lowerCase.pass ||
//     !errObj.totalNumber.pass ||
//     !errObj.upperCase.pass ||
//     !errObj.specialCh.pass ||
//     !errObj.numberofChar.pass
//   ) {
//     checkPassComplexity.addIssue({
//       code: "custom",
//       path: ["password"],
//       message: errObj as any,
//     });
//   }
// });
// export type EmailPasswordConfirmForm = z.infer<typeof emailPasswordConfirmForm>;



