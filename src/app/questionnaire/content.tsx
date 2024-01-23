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
        text: "Avez-vous complété la fiche patient ?",
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
        infoCondition: [
          {
            info: `
              <div>
                Dans ce cas, suivre les consignes de l’alerte. <br/>
                Exemple : donner un rendez-vous uniquement avec le médecin traitant, même pour les urgences.
              </div>
            `,
            condition: {
              questionKey: "4",
              operator: "EQUALS",
              value: [true],
            },
          },
        ],
      },
    ],
  },
  {
    name: "Délai de consultation souhaité par le patient",
    questions: [
      {
        type: "terminatorButton",
        key: "5",
        text: "Rendez-vous non urgent ?",
        defaultAnswer: false,
        isRequired: false,
        variant: "default",
        buttonLabel: "Non urgent",
        stopFlowContent: {
          title: "Rendez-vous non urgent",
          content: `
            <div>
              Proposer un rendez-vous avec le médecin traitant, puis selectionner si le rendez-vous a été donné ou non.
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
            postText: "Aucun créneau du médecin traitant ne convient au patient.",
            warning:
              "Le patient n'a pas accepté de prendre un rendez-vous avec le médecin.",
          },
        },
      },
    ],
    continueLabel: "Rendez-vous urgent, continuer",
  },
  {
    name: "Motif de consultation",
    questions: [
      {
        type: "select",
        key: "7",
        text: "Quel âge a le patient ?",
        placeholder: "Sélectionner une tranche d'âge",
        defaultAnswer: "",
        isRequired: true,
        options: [
          { value: "1", label: "Moins de 6 mois" },
          { value: "2", label: "Entre 6 mois et 80 ans" },
          { value: "3", label: "Plus de 80 ans" },
        ],
        dependents: ["8"],
      },
      {
        type: "body",
        key: "8",
        text: "Aide à l’orientation vers le 15 pour les urgences vitales ?",
        description: `
          <p>
            Demander le motif de consultation puis sélectionner la zone du corps concernée.<br />
            Si le patient présente l’un de ces symptômes, il s'agit d'une urgence nécessitant une prise en charge par le 15.<br />
            Demander au patient de contacter le 15, et s’assurer dans une quinzaine de minutes de la réponse apporté par le 15 en recontactant le patient. 
          </p>
        `,
        defaultAnswer: "",
        isRequired: false,
        options: {
          Torse: [
            "Crise d’asthme et/ou difficulté respiratoire",
            "Douleur thoracique",
          ],
          "Bras Gauche": [
            "Douleur aiguë d’une articulation avec fièvre",
            "Trouble sensitif et/ou moteur",
            "Douleur aiguë de membre",
          ],
          "Bras Droit": [
            "Douleur aiguë d’une articulation avec fièvre",
            "Trouble sensitif et/ou moteur",
            "Douleur aiguë de membre",
          ],
          Tête: [
            "Trouble sensitif et/ou moteur",
            "Céphalée inhabituelle et brutale",
            "Fièvre avec mauvaise tolérance: convulsion, somnolence, hydratation impossible",
            "Convulsions",
          ],
          Abdomen: [
            "Douleur pelvienne brutale, violente et inhabituelle",
            "Douleur abdominale brutale et violente avec fièvre",
            "Douleur testiculaire",
          ],
          "Jambe Gauche": [
            "Douleur aiguë d’une articulation avec fièvre",
            "Trouble sensitif et/ou moteur",
            "Douleur aiguë de membre",
          ],
          "Jambe Droite": [
            "Douleur aiguë d’une articulation avec fièvre",
            "Trouble sensitif et/ou moteur",
            "Douleur aiguë de membre",
          ],
        },
        displayCondition: {
          questionKey: "7",
          operator: "EQUALS",
          value: ["2"],
        },
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "7",
          operator: "IS_ANY_IN",
          value: ["1", "3"],
        },
        content: {
          title: "Rendez-vous en urgence nécessaire.",
          content: `
              Trouver un rendez-vous en urgence avec le médecin traitant.
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous en urgence donné",
              warning:
                "Un rendez-vous en urgence a été donné au patient avec le médecin.",
              reason: "Rendez-vous en urgence donné",
            },
          ],
          continueFlowButton: {
            label: "Mot laissé au médecin",
            postText:
              "Aucun rdv d’urgence disponible dans le planning du médecin traitant.",
            warning:
              "Un mot a été laissé au médecin pour qu'il rappelle le patient, continuer vers les ressources du patient.",
          },
        },
      },
      {
        condition: {
          questionKey: "8",
          operator: "NOT_IS_EMPTY",
        },
        content: {
          title: "Prise en charge en urgence.",
          content: `
            <div>
              Le patient doit appeler le 15 pour une prise en charge en urgence rapide.<br />
              Informer le médecin de la situation du patient.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Médecin informé et patient redirigé",
              warning:
                "Le patient a été redirigé vers le 15 et le médecin a été informé.",
              reason: "Situation nécessitant une prise en charge par le 15.",
            },
          ],
        },
      },
    ],
  },
  {
    name: "Difficultés rencontrées et ressources internes",
    questions: [
      {
        type: "multiChoice",
        key: "9",
        text: "Demander en quoi ce motif semble urgent au patient.",
        defaultAnswer: [],
        isRequired: false,
        options: [
          {
            value: "1",
            label: "Trouve-t-il que cela dure trop longtemps ? ",
          },
          { value: "2", label: "Trouve-t-il les symptômes trop graves ?" },
          {
            value: "3",
            label: "S'agit-il de symptômes inhabituels/inconnus ?",
          },
          {
            value: "4",
            label:
              "Cela engendre-t-il une situation stressante, qui semble ingérable ?",
          },
          {
            value: "5",
            label:
              "A-t-il pris quelque chose pour se soigner et si oui, cela a-t-il eu un effet ?",
          },
          { value: "6", label: "En a-t-il parler avec le pharmacien ?" },
        ],
      },
      {
        type: "multiChoice",
        key: "10",
        text: "Demander au patient ce qu’il a essayé de faire pour améliorer ses symptômes.",
        defaultAnswer: [],
        isRequired: false,
        options: [
          {
            value: "1",
            label:
              "A-t-il suivi les conseils hygiéno-diététiques habituels (DRP, hydratation…) ?",
          },
          { value: "2", label: "A-t-il pris quelque chose pour se soigner ? " },
          {
            value: "3",
            label: "En a-t-il parlé avec le pharmacien ? ",
          },
        ],
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "9",
          operator: "SELECTED_EQUALS",
          value: 0,
        },
        content: {
          title: "Aucune difficulté rencontrée.",
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
          questionKey: "9",
          operator: "SELECTED_EQUALS",
          value: 1,
        },
        content: {
          title: "Une seule difficulté rencontrée.",
          content: `
            <div>
              On peut proposer au patient de différer son rendez-vous, si cela lui semble possible.
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
