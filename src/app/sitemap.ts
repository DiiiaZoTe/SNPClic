import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/contact",
    "/faq",
    "/conditions-utilisation",
    "/mentions-legales",
    "/politique-confidentialite",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}