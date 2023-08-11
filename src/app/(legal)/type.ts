export type LegalContentType = {
  subtitle: string;
  subcontent: string;
  url: string;
}[];

export type LegalType = {
  title: string;
  content: LegalContentType;
}[];

export type ConditionsType = {
  title: string;
  content: string;
}[];