import { Form } from "./types";

//note to use a uid for the keys (more likely the id from the db)
export const FORM_DATA: Form = {
  id: "1",
  name: "Questionnaire SNPClic",
  config: [
    //******************************************************
    //*                      STEP 1
    //******************************************************
    {
      name: "Identification du patient",
      questions: [
        {
          type: "boolean",
          id: "1634ce62-c52c-4cbd-9142-7a99484c5526",
          text: "Prendre l'identité du patient.",
          defaultAnswer: false,
          isRequired: false,
        },
        {
          type: "boolean",
          id: "75e9bc14-c9d8-4b21-80fb-3af3ddab7923",
          text: "Le patient est-il connu du cabinet ?",
          defaultAnswer: false,
          isRequired: false,
        },
        {
          type: "boolean",
          id: "a93172fd-a2f7-46b7-8988-2cd309ccd8e0",
          text: "Avez-vous complété la fiche patient ?",
          defaultAnswer: false,
          popupInfo:
            "Nom, prénom, téléphone, adresse mail, adresse avec étage et code de la porte si nécessaire",
          isRequired: false,
        },
        {
          type: "boolean",
          id: "d9ad1fc5-44b5-48f4-b70e-9d7cc5689362",
          text: "Y-a-t-il une alerte sur la fiche patient ?",
          description: "Ex. Patient fragile,...",
          defaultAnswer: false,
          isRequired: false,
          infoCondition: [
            {
              info: `<div>Dans ce cas, suivre les consignes de l’alerte. <br/>Exemple : donner un rendez-vous uniquement avec le médecin traitant, même pour les urgences.</div>`,
              condition: {
                questionID: "d9ad1fc5-44b5-48f4-b70e-9d7cc5689362",
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
      description:
        "Demander au patient dans quel délais il souhaite prendre rendez-vous.",
      questions: [
        {
          type: "terminatorButton",
          id: "214691b5-0e62-4fbd-9a37-6f71166cd2c4",
          text: "Rendez-vous non urgent ?",
          defaultAnswer: false,
          isRequired: false,
          variant: "default",
          buttonLabel: "Continuer",
          stopFlowContent: {
            title: "Rendez-vous non urgent",
            content: `<div>Proposer un rendez-vous avec le médecin <b>traitant</b>, puis selectionner si le rendez-vous a été donné ou non.</div>`,
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
                "Si aucun créneau du médecin traitant n’est compatible avec l’agenda du patient, et qu’il existe un réel besoin médical ne pouvant être reporté : continuer vers l’étape 5.",
            },
            continueToStep: 5,
          },
        },
        {
          type: "terminatorButton",
          id: "755777b3-4196-48ef-a8fe-68695df7b715",
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
          id: "aeb43e42-0821-4226-886b-7e19c0ba1168",
          text: "Quel âge a le patient ?",
          placeholder: "Sélectionner une tranche d'âge",
          defaultAnswer: "",
          isRequired: true,
          options: [
            { value: "1", label: "Moins de 6 mois" },
            { value: "2", label: "Entre 6 mois et 80 ans" },
            { value: "3", label: "Plus de 80 ans" },
          ],
          dependents: ["90373feb-e039-4599-8629-2fb68e1a6b9f"],
        },
        {
          type: "body",
          id: "90373feb-e039-4599-8629-2fb68e1a6b9f",
          text: "Aide à l’orientation vers le 15 pour les urgences vitales.",
          description: `<p>Demander le motif de consultation puis sélectionner la zone du corps concernée.<br />Si le patient présente l’un de ces symptômes, il s'agit d'une urgence nécessitant une prise en charge par le 15.<br />Demander au patient de contacter le 15, et s’assurer dans une quinzaine de minutes de la réponse apporté par le 15 en recontactant le patient. </p>`,
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
            questionID: "aeb43e42-0821-4226-886b-7e19c0ba1168",
            operator: "EQUALS",
            value: ["2"],
          },
        },
      ],
      stopFlowCondition: [
        {
          condition: {
            questionID: "aeb43e42-0821-4226-886b-7e19c0ba1168",
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
            questionID: "90373feb-e039-4599-8629-2fb68e1a6b9f",
            operator: "NOT_IS_EMPTY",
          },
          content: {
            title: "Prise en charge en urgence.",
            content: `<div>Le patient doit appeler le 15 pour une prise en charge en urgence rapide.<br />Informer le médecin de la situation du patient.<br />Recontacter le patient afin de connaitre la réponse apportée par le 15.</div>`,
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
          id: "3a6737af-6594-4577-8ce6-a13c4062abad",
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
              label: "S'agit-il de symptômes inhabituels ou inconnus ?",
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
          id: "4328a918-b200-404a-9a3e-acc1f4059252",
          text: "Demander au patient ce qu’il a essayé de faire pour améliorer ses symptômes.",
          defaultAnswer: [],
          isRequired: false,
          options: [
            {
              value: "1",
              label:
                "A-t-il suivi les conseils hygiéno-diététiques habituels (DRP, hydratation…) ?",
            },
            {
              value: "2",
              label: "A-t-il pris quelque chose pour se soigner ? ",
            },
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
            questionID: "3a6737af-6594-4577-8ce6-a13c4062abad",
            operator: "SELECTED_EQUALS",
            value: 0,
          },
          content: {
            title: "Aucune difficulté rencontrée.",
            content: `<div>Nous vous conseillons de différer le rendez-vous du patient.</div>`,
            stopFlowButtons: [
              {
                label: "Rendez-vous différé",
                preText:
                  "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
                reason:
                  "Aucune ressource interne sélectionnée, rendez-vous différé.",
              },
              {
                label: "Rendez-vous en urgence donné",
                preText:
                  "Le patient ne souhaite pas différer son rendez-vous. Un rendez-vous en urgence a été donné avec le médecin traitant.",
                reason:
                  "Aucune ressource interne sélectionnée, rendez-vous en urgence avec le médecin traitant donné.",
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
        {
          condition: {
            questionID: "3a6737af-6594-4577-8ce6-a13c4062abad",
            operator: "SELECTED_EQUALS",
            value: 1,
          },
          content: {
            title: "Une seule difficulté rencontrée.",
            content: `<div>On peut proposer au patient de différer son rendez-vous, si cela lui semble possible.</div>`,
            stopFlowButtons: [
              {
                label: "Rendez-vous différé",
                preText:
                  "Rappeler au patient les resources externes disponibles, ainsi que de revenir vers nous si ces symptômes persistent ou s'aggravent.",
                reason:
                  "Une seule ressource interne sélectionnée, rendez-vous différé.",
              },
              {
                label: "Rendez-vous en urgence donné",
                preText:
                  "Le patient ne souhaite pas différer son rendez-vous. Un rendez-vous en urgence a été donné avec le médecin traitant.",
                reason:
                  "Une seule ressource interne sélectionnée, rendez-vous en urgence avec le médecin traitant donné.",
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
        {
          condition: {
            questionID: "3a6737af-6594-4577-8ce6-a13c4062abad",
            operator: "SELECTED_GREATER_THAN_OR_EQUALS",
            value: 2,
          },
          content: {
            title: "Au moins 2 difficultés rencontrées.",
            content: `<div>Trouver un rendez-vous en urgence avec le médecin <b>traitant</b>.</div>`,
            stopFlowButtons: [
              {
                label: "Rendez-vous en urgence donné ",
                reason:
                  "Au moins deux ressources internes sélectionnées, rendez-vous différé.",
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
          id: "c552f115-4265-40cf-a164-811d622db024",
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
          id: "02cfce40-15f9-473b-a258-ab372b3d9218",
          text: "2. Vérifier les connaissances du patient sur le parcours de soins via le 15:",
          description: `<ul class="bulletList"><li>Service d’accès aux soins (SAS) en journée</li><li>Garde fixe lors de la permanence de soin (maison médicale de garde)</li><li>Garde mobile lors de la permanence de soins (SOS médecins…) </li></ul>`,
          defaultAnswer: false,
          isRequired: false,
        },
        {
          type: "boolean",
          id: "d3ed41ff-defd-419b-b989-cd780da16612",
          text: "3. Est-il capable de reformuler son orientation dans le parcours de soins et accepte-t-il de contacter le 15 le cas échéant ?",
          defaultAnswer: false,
          isRequired: false,
          infoCondition: [
            {
              info: `<p>Laisser un message au médecin traitant, tout en informant le patient qu’il ne sera pas forcément recontacté.<br /> Insister sur l’intérêt de joindre le médecin régulateur du 15.<br />Éventuellement envoyer la consigne par email ou SMS au patient. </p>`,
              condition: {
                type: "OR",
                conditions: [
                  {
                    questionID: "d3ed41ff-defd-419b-b989-cd780da16612",
                    operator: "EQUALS",
                    value: [false],
                  },
                  {
                    questionID: "aeb43e42-0821-4226-886b-7e19c0ba1168",
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
                questionID: "d3ed41ff-defd-419b-b989-cd780da16612",
                operator: "EQUALS",
                value: [false],
              },
              {
                questionID: "aeb43e42-0821-4226-886b-7e19c0ba1168",
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
          id: "6bad5100-696c-458a-9598-e72b9ed0db7e",
          text: "Nom complet du patient",
          defaultAnswer: "",
          isRequired: true,
        },
        {
          type: "textarea",
          id: "a14baaec-1ab7-4481-b15f-547c4fb49d8d",
          text: "Motif(s) de la demande",
          defaultAnswer: "",
          isRequired: false,
        },
      ],
    },
  ],
};
