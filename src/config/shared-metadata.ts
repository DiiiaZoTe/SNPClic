import { siteConfig } from "./site";

/**
 *  @example
    const METADATA = {
      title: "Questionnaire",
      description: "Questionnaire de demande de soin non programmé",
      url: siteConfig.url+"/questionnaire",
    }

    export const metadata = {
      title: METADATA.title,
      description: METADATA.description,
      keywords: "if any, comma separated keywords for SEO purposes",
      ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
    };
 */
export const getSharedMetadata = (title?: string, description?: string, url?: string) => {
  return {
    metadataBase: new URL(siteConfig.url),
    authors: [
      ...siteConfig.authors.map((author) => ({
        name: author,
      })),
    ],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: url ?? siteConfig.url,
      title: `${title} - ${siteConfig.name}` ?? siteConfig.name,
      description: description ?? siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.url + siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${siteConfig.name}` ?? siteConfig.name,
      description: description ?? siteConfig.description,
      images: [siteConfig.ogImage],
    },
    icons: {
      icon: "/favicon/favicon.ico",
      shortcut: "/favicon/favicon-16x16.png",
    }
  }
}