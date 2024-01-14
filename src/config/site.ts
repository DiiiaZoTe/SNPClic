export const siteConfig = {
  name: "SNPClic",
  url: process.env.ENVIRONMENT == 'production'
    ? "https://snpclic.fr"
    : process.env.ENVIRONMENT == 'preview'
      ? "https://snpclic-preview.alexvencel.com"
      : "http://localhost:3000",
  ogImage: "/og.png",
  description:
    "SNPClic est un outil indépendant d’aide à l’orientation des patients en demande de soins non programmés par les secrétaires",
  author: "Katarina Vencel",
}

export const githubConfig = {
  repo: "https://github.com/DiiiaZoTe/SNPClic"
}

export type SiteConfig = typeof siteConfig