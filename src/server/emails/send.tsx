"server only";

import {
  Resend,
  CreateEmailOptions as OriginalCreateEmailOptions,
  CreateEmailRequestOptions,
} from "resend";

import { emailConfig } from "@/config/email";

// Extend the original CreateEmailOptions and make 'from' optional
interface CreateEmailOptions extends Omit<OriginalCreateEmailOptions, "from"> {
  from?: OriginalCreateEmailOptions["from"];
  react: React.ReactElement; // Always use a react template
  html?: never; // Explicitly disallow 'html'
  text?: never; // Explicitly disallow 'text'
}

export async function sendEmail(
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions
) {
  const resend = new Resend();
  const { from, ...restPayload } = payload;
  return resend.emails.send(
    {
      from: from ?? emailConfig.from,
      ...restPayload,
    },
    options
  );
}
