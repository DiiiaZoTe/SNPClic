export const siteConfig = {
  name: "SNPClic",
  url: process.env.NODE_ENV == 'production' ? "https://snpclic.fr" : "http://localhost:3000",
  ogImage: "og link here",
  description:
    "Description here",
  author: "Katarina Vencel",
}

export const githubConfig = {
  repo: "/"
}

export type SiteConfig = typeof siteConfig