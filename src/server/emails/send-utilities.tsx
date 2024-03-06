"server only";

import { sendEmail } from "@/server/emails/send";

import EmailVerification from "@/../emails/email-verification";
import EmailAccountCreatedTempPass from "@/../emails/account-created-temp";
import ResetPasswordEmail from "@/../emails/reset-password";

export async function sendEmailEmailVerification(email: string, code: string) {
  return sendEmail({
    to: email,
    subject: "Vérifiez votre adresse e-mail",
    react: <EmailVerification code={code} />,
  });
}

export async function sendEmailAccountCreatedTempPass(
  email: string,
  password: string
) {
  return sendEmail({
    to: email,
    subject: "Compte SNPClic créé",
    react: <EmailAccountCreatedTempPass password={password} />,
  });
}

export async function sendEmailResetPassword(email: string, link: string) {
  return sendEmail({
    to: email,
    subject: "Réinitialiser votre mot de passe",
    react: <ResetPasswordEmail link={link} />,
  });
}
