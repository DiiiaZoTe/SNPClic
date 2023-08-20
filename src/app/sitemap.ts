import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
    },
    {
      url: siteConfig.url + '/contact',
      lastModified: new Date(),
    },
    {
      url: siteConfig.url + '/faq',
      lastModified: new Date(),
    },
    {
      url: siteConfig.url + '/conditions-utilisation',
      lastModified: new Date(),
    },
    {
      url: siteConfig.url + '/mentions-legales',
      lastModified: new Date(),
    },
    {
      url: siteConfig.url + '/politique-confidentialite',
      lastModified: new Date(),
    },
  ]
}