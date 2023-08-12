export type SubContentType = (string | {
  value: string;
  url: string;
})[];

export type ContentType = {
  name: string;
  role: string;
  content: SubContentType;
}[];