// resend does not export
// - CreateEmailRequestOptions
// - CreateEmailOptions
// so we need to define them here

import * as React from 'react';

interface PostOptions {
  query?: {
    [key: string]: any;
  };
}

export type CreateEmailRequestOptions = PostOptions;

interface EmailRenderOptions {
  react?: React.ReactElement | React.ReactNode | null;
  html?: string;
  text?: string;
}

interface CreateEmailBaseOptions {
  attachments?: Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
  from: string;
  headers?: Record<string, string>;
  reply_to?: string | string[];
  subject: string;
  tags?: Tag[];
  to: string | string[];
}

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type CreateEmailOptions = RequireAtLeastOne<EmailRenderOptions> & CreateEmailBaseOptions;

interface Attachment {
  content?: string | Buffer;
  filename?: string | false | undefined;
  path?: string;
}

type Tag = {
  name: string;
  value: string;
};