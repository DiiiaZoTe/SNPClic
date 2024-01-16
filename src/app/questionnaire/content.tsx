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
        isRequired: false,
      },
      {
        type: "boolean",
        key: "2",
        text: "Le patient est-il connu du cabinet ?",
        defaultAnswer: false,
        isRequired: false,
      },
      {
        type: "boolean",
        key: "3",
        text: "Avez-vous complétez la fiche patient ?",
        defaultAnswer: false,
        popupInfo:
          "Nom, prénom, téléphone, adresse mail, adresse avec étage et code de la porte si nécessaire",
        isRequired: false,
      },
      {
        type: "boolean",
        key: "4",
        text: "Y-a-t-il une alerte sur la fiche patient ?",
        description: "Ex. Patient fragile,...",
        defaultAnswer: false,
        isRequired: false,
      },
    ],
  },
  {
    name: "Délai de consultation souhaité",
    questions: [
      // {
      //   type: "boolean",
      //   key: "6",
      //   text: "Rendez-vous non urgent, proposer un RDV avec le médecin traitant.",
      //   defaultAnswer: false,
      //   isRequired: false,
      // },
      {
        type: "boolean",
        key: "7",
        text: "Rendez-vous en urgence souhaité, demander le motif de consultation",
        defaultAnswer: false,
        isRequired: false,
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "7",
          operator: "EQUALS",
          value: [false],
        },
        content: {
          title: "Rendez-vous non urgent",
          content: `
            <div>
              Proposer un rendez-vous avec le médecin, puis selectionner si le rendez-vous a été donné ou non.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous donné",
              warning:
                "Le patient a accepté de prendre un rendez-vous avec le médecin.",
              reason: "Rendez-vous non urgent donné",
            },
          ],
          continueFlowButton: {
            label: "Continuer",
            warning:
              "Le patient n'a pas accepté de prendre un rendez-vous avec le médecin.",
          },
        },
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
        },
        displayCondition: {
          questionKey: "8",
          operator: "EQUALS",
          value: ["2"],
        },
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "8",
          operator: "IS_ANY_IN",
          value: ["1", "3"],
        },
        content: {
          title: "Rendez-vous en urgence nécessaire.",
          content: `
            <div>
              Trouver un rendez-vous en urgence pour le patient.<br />
              Si pas de disponibilité, laisser un mot au médecin.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous en urgence donné",
              warning:
                "Un rendez-vous en urgence a été donné au patient avec le médecin.",
              reason: "Rendez-vous en urgence donné",
            },
            {
              label: "Mot laissé au médecin",
              warning:
                "Un mot a été laissé au médecin pour qu'il rappelle le patient.",
              reason: "Mot laissé au médecin, pas de rendez-vous en urgence donné",
            },
          ],
        },
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
          {
            value: "1",
            label:
              "Trouve-t-il que les symptômes durent plus longtemps qu'habituellement ?",
          },
          { value: "2", label: "Trouve-t-il les symptômes trop grave ?" },
          {
            value: "3",
            label: "S'agit-il de symptômes inhabituels/inconnus ?",
          },
          { value: "4", label: "Est-il préoccupé par les symptômes ?" },
          {
            value: "5",
            label:
              "A-t-il pris quelque chose pour se soigner et si oui, cela a-t-il eu un effet ?",
          },
          { value: "6", label: "En a-t-il parler avec le pharmacien ?" },
        ],
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "10",
          operator: "SELECTED_EQUALS",
          value: 0,
        },
        content: {
          title: "Aucune ressource interne sélectionnée.",
          content: `
            <div>
              Nous vous conseillons de différer le rendez-vous du patient.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Différer le rendez-vous",
              warning:
                "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
              reason: "Aucune ressource interne sélectionnée",
            },
          ],
          continueFlowButton: {
            label: "Continuer sans différer",
            warning: "Le patient ne souhaite pas différer.",
          },
        },
      },
      {
        condition: {
          questionKey: "10",
          operator: "SELECTED_EQUALS",
          value: 1,
        },
        content: {
          title: "Une seule ressource interne sélectionnée.",
          content: `
            <div>
              Il faut essayer de proposer au patient de différer son rendez-vous.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Différer le rendez-vous",
              warning:
                "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
              reason: "Une seule ressource interne sélectionnée",
            },
          ],
          continueFlowButton: {
            label: "Continuer sans différer",
            warning: "Le patient ne souhaite pas différer.",
          },
        },
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
            value: "1",
            label: "Vérifier la disponibilité d'un rendez-vous en urgence.",
          },
          {
            value: "2",
            label:
              "Si pas de disponibilité d'un rendez-vous en urgence, laissez un message.",
          },
          {
            value: "3",
            label:
              "Vérifier les connaissances du patient (téleconsultation, maison médicale de garde, 15).",
          },
        ],
      },
    ],
  },
];
