import { env } from "@/env";

export const siteConfig = {
  name: "SNPClic",
  url: env.NEXT_PUBLIC_ENVIRONMENT == 'production'
    ? (
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://snpclic.fr"
    )
    : env.NEXT_PUBLIC_ENVIRONMENT == 'preview'
      ? "https://preview.snpclic.fr"
      : `http://localhost:${process.env.PORT ?? 3000}`,
  ogImage: "https://res.cloudinary.com/dimdlqjzv/image/upload/v1708814602/SNPClic/og-snpclic.png",
  ogImageOnSite: undefined,
  description:
    "SNPClic est un outil indépendant d’aide à l’orientation des patients en demande de soins non programmés par les secrétaires",
  authors: ["Katarina Vencel", "Alexander Vencel"],
}

export const githubConfig = {
  repo: "https://github.com/DiiiaZoTe/SNPClic"
}
