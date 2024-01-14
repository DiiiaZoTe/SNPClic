export type ContentType = {
  title: string;
  paragraphs: string[]; // array of paragraphs
};


export const HOME_CONTENT = {
  title: `<b>SNPClic</b> est un <b>outil indépendant</b> d’aide à l’orientation des patients en demande de soins non programmés par les secrétaires.`,
  paragraphs: [
    `Ce site est né à la suite d'observations d'appels de demande de soins non programmés. Les
    résultats proposés n’ont pour objectif que d’aider les secrétaires à amener le patient vers
    une décision partagée quant à la nécessité d’une consultation en urgence de soins non
    programmées.`,
    `Ce site est une <b>source d’aide</b>, il n’a cependant <b>pas pour vocation à se substituer à une
    décision médicale</b>. En cas de doute sur un symptôme ou la gravité d’une situation, il est
    nécessaire de se rapprocher d’un médecin de la structure. <b>Ce site est à usage des
    professionnels de santé</b>.`,
  ]
} as ContentType;
