import { Form } from "./types";

//note to use a uid for the keys (more likely the id from the db)
export const FORM_DATA: Form = [
  {
    name: "Identification du patient",
    questions: [
      {
        type: "boolean",
        key: "1",
        text: "Prendre l'identité du patient.",
        defaultAnswer: false,
        isRequired: false
      },
      {
        type: "boolean",
        key: "2",
        text: "Le patient est-il connu du cabinet ?",
        defaultAnswer: false,
        isRequired: false
      },
      {
        type: "boolean",
        key: "3",
        text: "Avez-vous complétez la fiche patient ?",
        defaultAnswer: false,
        popupInfo: "Nom, prénom, téléphone, adresse mail, adresse avec étage et code de la porte si nécessaire",
        isRequired: false
      },
      {
        type: "boolean",
        key: "4",
        text: "Y-a-t-il une alerte sur la fiche patient ?",
        description: "Ex. Patient fragile,...",
        defaultAnswer: false,
        isRequired: false
      },
    ],
  },
  {
    name: "Délai de consultation souhaité",
    questions: [
      {
        type: "boolean",
        key: "6",
        text: "Rendez-vous non urgent, proposer un RDV avec le médecin traitant.",
        defaultAnswer: false,
        isRequired: false
      },
      {
        type: "boolean",
        key: "7",
        text: "Rendez-vous en urgence souhaité, demander le motif de consultation",
        defaultAnswer: false,
        isRequired: false
      },
    ],
  },
  {
    name: "Motif de consultation",
    questions: [
      {
        type: "select",
        key: "8",
        text: "Quel âge a le patient ?",
        placeholder: "Sélectionner une tranche d'âge",
        defaultAnswer: "",
        isRequired: true,
        options: [
          { value: "1", label: "Moins de 6 mois" },
          { value: "2", label: "Entre 6 mois et 80 ans" },
          { value: "3", label: "Plus de 80 ans" },
        ],
        dependents: ["9"],
      },
      {
        type: "body",
        key: "9",
        text: "Quels sont les motifs de consultation ?",
        defaultAnswer: "",
        isRequired: true,
        options: {
          Torso: "Heart, lungs, stomach, liver, intestines, kidneys, bladder",
          "Arm Left": "Muscle, Broken bones",
          "Arm Right": "Muscle, Broken bones",
          Head: "Eyes, Ears, Nose, Mouth, Teeth",
          Crotch: "Genitals, Bladder, Rectum",
          "Leg Left": "Muscle, Broken bones",
          "Leg Right": "Muscle, Broken bones",
        }
        ,
        displayCondition: {
          questionKey: "8",
          operator: "EQUALS",
          value: ["2"],
        }
      },
    ],
  },
  {
    name: "Evaluation des ressources internes du patient",
    questions: [
      {
        type: "multiChoice",
        key: "10",
        text: "Selectionner les ressources internes du patient:",
        defaultAnswer: [],
        isRequired: false,
        options: [
          { value: "1", label: "Trouve-t-il que les symptômes durent plus longtemps qu'habituellement ?" },
          { value: "2", label: "Trouve-t-il les symptômes trop grave ?" },
          { value: "3", label: "S'agit-il de symptômes inhabituels/inconnus ?" },
          { value: "4", label: "Est-il préoccupé par les symptômes ?" },
          { value: "5", label: "A-t-il pris quelque chose pour se soigner et si oui, cela a-t-il eu un effet ?" },
          { value: "6", label: "En a-t-il parler avec le pharmacien ?" },
        ]
      },
    ],
  },
  {
    name: "Evaluer les ressources externes du patient",
    questions: [
      {
        type: "multiChoice",
        key: "11",
        text: "Le patient ne pense pas pouvoir différer sa consultation:",
        defaultAnswer: [],
        isRequired: false,
        options: [
          {
            value: "1", // this can be the id of the option from db
            label: "Vérifier la disponibilité d'un rendez-vous en urgence.",
          },
          {
            value: "2", // this can be the id of the option from db
            label:
              "Si pas de disponibilité d'un rendez-vous en urgence, laissez un message.",
          },
          {
            value: "3", // this can be the id of the option from db
            label:
              "Vérifier les connaissances du patient (téleconsultation, maison médicale de garde, 15).",
          },
        ],
      },
    ],
  },
];