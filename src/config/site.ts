export const siteConfig = {
  name: "SNPClic",
  url: process.env.ENVIRONMENT == 'production'
    ? "https://snpclic.fr"
    : process.env.ENVIRONMENT == 'preview'
      ? "https://preview.snpclic.fr"
      : "http://localhost:3000",
  ogImage: "/og.png",
  description:
    "SNPClic est un outil indépendant d’aide à l’orientation des patients en demande de soins non programmés par les secrétaires",
  authors: ["Katarina Vencel", "Alexander Vencel"],
}

export const githubConfig = {
  repo: "https://github.com/DiiiaZoTe/SNPClic"
}
