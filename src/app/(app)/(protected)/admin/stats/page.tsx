import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

const METADATA = {
  title: "Admin - Stats",
  description: "Gestion des stats SNPClic",
  url: siteConfig.url + "/admin/stats",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default function Page() {
  return (
    <div>
      <h1>Statistiques</h1>
    </div>
  );
}
