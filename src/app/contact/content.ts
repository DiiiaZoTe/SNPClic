import { ContentType } from "./content-type";

export const CONTACT_CONTENT = [
  {
    name: "Katarina Vencel",
    role: "e.g. Interne de médecine générale...",
    content: [
      "Contacter par email à l'adresse suivante:",
      {
        value: "katarina.vencel@hotmail.fr",
        url: "mailto:katarina.vencel@hotmail.fr",
      },
    ],
  },
  {
    name: "Dr. Christophe Carriere",
    role: "Directeur de thèse",
    content: ["Contacter par email à la même adresse que Katarina Vencel."],
  },
  {
    name: "Alexander Vencel",
    role: "Développeur",
    content: [
      "Pour tout problème technique, ouvrir une issue sur le repo GitHub du projet:",
      {
        value: "Repo GitHub",
        url: "#",
      },
    ],
  },
] as ContentType;