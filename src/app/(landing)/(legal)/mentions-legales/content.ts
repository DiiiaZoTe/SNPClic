import { githubConfig } from "@/config/site";
import type { LegalType } from "../type";

export const LEGAL_CONTENT = [
  {
    "title": "Auteurs",
    "content": [
      {
        "subtitle": "Directeur de publication",
        "subcontent": "Docteur Christophe Carrière"
      },
      {
        "subtitle": "Recherche",
        "subcontent": "Katarina Vencel"
      },
      {
        "subtitle": "Développement",
        "subcontent": "Alexander Vencel (GitHub)",
        "url": "https://github.com/DiiiaZoTe"
      }
    ]
  },
  {
    "title": "Information du site",
    "content": [
      {
        "subtitle": "Nom du site",
        "subcontent": "SNPClic"
      },
      {
        "subtitle": "Lien du site",
        "subcontent": "https://snpclic.fr"
      },
      {
        "subtitle": "Hébergeur",
        "subcontent": "Hetzner",
      }
    ]
  },
  {
    "title": "Information de licence",
    "content": [
      {
        "subtitle": "Licence",
        "subcontent": "AGPL-3.0",
        "url": "https://www.gnu.org/licenses/agpl-3.0.fr.html"
      },
      {
        "subtitle": "Code source",
        "subcontent": "GitHub",
        "url": githubConfig.repo
      }
    ]
  }
] as LegalType;
