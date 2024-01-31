import { Form } from "./types";

//note to use a uid for the keys (more likely the id from the db)
export const FORM_DATA: Form = [
  //******************************************************
  //*                      STEP 1
  //******************************************************
  {
    name: "Identification du patient",
    questions: [
      {
        type: "boolean",
        key: "1-1",
        text: "Prendre l'identité du patient.",
        defaultAnswer: false,
        isRequired: false,
      },
      {
        type: "boolean",
        key: "1-2",
        text: "Le patient est-il connu du cabinet ?",
        defaultAnswer: false,
        isRequired: false,
      },
      {
        type: "boolean",
        key: "1-3",
        text: "Avez-vous complété la fiche patient ?",
        defaultAnswer: false,
        popupInfo:
          "Nom, prénom, téléphone, adresse mail, adresse avec étage et code de la porte si nécessaire",
        isRequired: false,
      },
      {
        type: "boolean",
        key: "1-4",
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
              questionKey: "1-4",
              operator: "EQUALS",
              value: [true],
            },
          },
        ],
      },
    ],
  },
  //******************************************************
  //*                      STEP 2
  //******************************************************
  {
    name: "Délai de consultation souhaité par le patient",
    questions: [
      {
        type: "terminatorButton",
        key: "2-1",
        text: "Rendez-vous non urgent ?",
        defaultAnswer: false,
        isRequired: false,
        variant: "default",
        buttonLabel: "Continuer",
        stopFlowContent: {
          title: "Rendez-vous non urgent",
          content: `
            <div>
              Proposer un rendez-vous avec le médecin <b>traitant</b>, puis selectionner si le rendez-vous a été donné ou non.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous donné",
              preText:
                "Cliquez ici si le patient a accepté de prendre un rendez-vous avec le médecin traitant.",
              reason: "Rendez-vous non urgent donné.",
            },
          ],
          continueFlowButton: {
            label: "Continuer",
            preText:
              "Si aucun créneau du médecin traitant ne convient au patient, continuer vers les ressources externes du patient (étape 5).",
          },
          continueToStep: 5,
        },
      },
      {
        type: "terminatorButton",
        key: "2-2",
        text: "Rendez-vous urgent ?",
        defaultAnswer: false,
        isRequired: false,
        variant: "secondary",
        buttonLabel: "Continuer",
        stopFlowContent: {
          bypassModalStopReason: true,
          continueToStep: 3,
        },
      },
    ],
    continueLabel: "Rendez-vous urgent, continuer",
    noContinueButton: true,
  },
  //******************************************************
  //*                      STEP 3
  //******************************************************
  {
    name: "Motif de consultation",
    questions: [
      {
        type: "select",
        key: "3-1",
        text: "Quel âge a le patient ?",
        placeholder: "Sélectionner une tranche d'âge",
        defaultAnswer: "",
        isRequired: true,
        options: [
          { value: "1", label: "Moins de 6 mois" },
          { value: "2", label: "Entre 6 mois et 80 ans" },
          { value: "3", label: "Plus de 80 ans" },
        ],
        dependents: ["3-2"],
      },
      {
        type: "body",
        key: "3-2",
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
          questionKey: "3-1",
          operator: "EQUALS",
          value: ["2"],
        },
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          questionKey: "3-1",
          operator: "IS_ANY_IN",
          value: ["1", "3"],
        },
        content: {
          title: "Rendez-vous en urgence nécessaire.",
          content: `
              Trouver un rendez-vous en urgence avec le médecin <b>traitant</b>.
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous en urgence donné",
              preText:
                "Cliquez ici si un rendez-vous en urgence a été donné au patient avec le médecin traitant.",
              reason: "Rendez-vous en urgence donné.",
            },
          ],
          continueFlowButton: {
            label: "Continuer",
            preText:
              "« Aucun rendez-vous disponible dans le planning du médecin traitant, continuer vers les ressources externes du patient (étape 5).",
          },
          continueToStep: 5,
        },
      },
      {
        condition: {
          questionKey: "3-2",
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
              preText:
                "Le patient a été redirigé vers le 15 et le médecin a été informé.",
              reason: "Situation nécessitant une prise en charge par le 15.",
            },
          ],
          cancelFlowButton: {
            label: "Annuler",
          },
        },
      },
    ],
  },
  //******************************************************
  //*                      STEP 4
  //******************************************************
  {
    name: "Difficultés rencontrées et ressources internes",
    questions: [
      {
        type: "multiChoice",
        key: "4-1",
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
        ],
      },
      {
        type: "multiChoice",
        key: "4-2",
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
          questionKey: "4-1",
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
              label: "Rendez-vous différé",
              preText:
                "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
              reason: "Aucune ressource interne sélectionnée.",
            },
          ],
          continueFlowButton: {
            label: "Continuer sans différer",
            preText: "Si le patient ne souhaite pas différer son rendez-vous :",
          },
          continueToStep: 5,
        },
      },
      {
        condition: {
          questionKey: "4-1",
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
              label: "Rendez-vous différé",
              preText:
                "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
              reason: "Une seule ressource interne sélectionnée.",
            },
          ],
          continueFlowButton: {
            label: "Continuer sans différer",
            preText: "Si le patient ne souhaite pas différer son rendez-vous :",
          },
          continueToStep: 5,
        },
      },
      {
        condition: {
          questionKey: "4-1",
          operator: "SELECTED_GREATER_THAN_OR_EQUALS",
          value: 2,
        },
        content: {
          title: "Au moins 2 difficultés rencontrées.",
          content: `
            <div>
              Trouver un rendez-vous en urgence avec le médecin <b>traitant</b>.
            </div>
          `,
          stopFlowButtons: [
            {
              label: "Rendez-vous différé",
              reason: "Au moins deux ressources internes sélectionnées.",
            },
          ],
          continueFlowButton: {
            label: "Continuer",
            preText:
              "Aucun rendez-vous disponible dans le planning du médecin traitant, continuer vers les ressources externes du patient (étape 5)",
          },
          continueToStep: 5,
        },
      },
    ],
  },
  //******************************************************
  //*                      STEP 5
  //******************************************************
  {
    name: "Evaluer les ressources externes du patient",
    questions: [
      {
        type: "terminatorButton",
        key: "5-1",
        text: "1. Vérifier si d’autres médecins de la structure disposent de créneaux disponibles et les proposer au patient.",
        defaultAnswer: false,
        isRequired: false,
        variant: "default",
        buttonLabel: "Rendez-vous donné",
        stopFlowContent: {
          bypassModalStopReason:
            "Rendez-vous donné avec un autre médecin du cabinet.",
          // title: "Rendez-vous donné avec un autre médecin du cabinet.",
          // content: `
          //   <div>
          //     Veuillez valider votre sélection.
          //   </div>
          // `,
          // stopFlowButtons: [
          //   {
          //     label: "Rendez-vous donné",
          //     preText:
          //       "Cliquez ici si le patient a accepté de prendre un rendez-vous avec le médecin.",
          //     reason: "Rendez-vous donné avec un autre médecin du cabinet.",
          //   },
          // ],
          // cancelFlowButton: {
          //   label: "Annuler",
          // },
        },
      },
      {
        type: "boolean",
        key: "5-2",
        text: "2. Vérifier les connaissances du patient sur le parcours de soins via le 15:",
        description: `
          <ul class="bulletList">
            <li>Service d’accès aux soins (SAS) en journée</li>
            <li>Garde fixe lors de la permanence de soin (maison médicale de garde)</li>
            <li>Garde mobile lors de la permanence de soins (SOS médecins…) </li>
          </ul>
        `,
        defaultAnswer: false,
        isRequired: false,
      },
      {
        type: "boolean",
        key: "5-3",
        text: "3. Est-il capable de reformuler son orientation dans le parcours de soins et accepte-t-il de contacter le 15 le cas échéant ?",
        defaultAnswer: false,
        isRequired: false,
        infoCondition: [
          {
            info: `
              <p>
                Laisser un message au médecin traitant, tout en informant le patient qu’il ne sera pas forcément recontacté.<br /> 
                Insister sur l’intérêt de joindre le médecin régulateur du 15.<br />
                Éventuellement envoyer la consigne par email ou SMS au patient. 
              </p>
            `,
            condition: {
              type: "OR",
              conditions: [
                {
                  questionKey: "5-3",
                  operator: "EQUALS",
                  value: [false],
                },
                {
                  questionKey: "3-1",
                  operator: "IS_ANY_IN",
                  value: ["1", "3"],
                },
              ],
            },
          },
        ],
      },
    ],
    stopFlowCondition: [
      {
        condition: {
          type: "OR",
          conditions: [
            {
              questionKey: "5-3",
              operator: "EQUALS",
              value: [false],
            },
            {
              questionKey: "3-1",
              operator: "IS_ANY_IN",
              value: ["1", "3"],
            },
          ],
        },
        content: {
          bypassModalStopReason: true,
          continueToStep: 6,
        },
      },
      {
        condition: true,
        content: {
          bypassModalStopReason: true,
        },
      },
    ],
  },
  {
    name: "Informations complémentaires",
    questions: [
      {
        type: "text",
        key: "6-1",
        text: "Nom complet du patient",
        defaultAnswer: "",
        isRequired: true,
      },
      {
        type: "textarea",
        key: "6-2",
        text: "Notes additionnelles",
        defaultAnswer: "",
        isRequired: false,
      },
    ],
  },
];
