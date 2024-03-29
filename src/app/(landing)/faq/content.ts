export type ContentType = {
  title: string;
  questions: {
    question: string;
    answer: string;
  }[];
}[];

export const FAQ_CONTENT = [
  {
    "title": "Comment utiliser notre plateforme ?",
    "questions": [
      {
        "question": "Quelles sont les étapes pour publier un article sur la plateforme ?",
        "answer": "Pour publier un article, suivez ces étapes :..."
      },
      {
        "question": "Comment fonctionne le système de recherche avancée ?",
        "answer": "Notre système de recherche avancée vous permet de..."
      }
    ]
  },
  {
    "title": "Questions sur l'abonnement Premium",
    "questions": [
      {
        "question": "Quels sont les avantages inclus dans l'abonnement Premium ?",
        "answer": "L'abonnement Premium offre des avantages tels que..."
      },
      {
        "question": "Comment puis-je mettre à jour mes informations de paiement ?",
        "answer": "Pour mettre à jour vos informations de paiement, suivez ces étapes..."
      },
      {
        "question": "Y a-t-il des réductions pour les abonnés de longue date ?",
        "answer": "Oui, nous offrons des réductions spéciales pour nos abonnés fidèles..."
      }
    ]
  },
  {
    "title": "Assistance technique et problèmes courants",
    "questions": [
      {
        "question": "Que faire si mon compte est verrouillé pour des raisons de sécurité ?",
        "answer": "Si votre compte est verrouillé, veuillez suivre ces étapes pour le débloquer..."
      },
      {
        "question": "Comment signaler un bug ou un problème technique ?",
        "answer": "Si vous rencontrez un bug, vous pouvez nous le signaler en utilisant..."
      },
      {
        "question": "Je ne parviens pas à télécharger mes fichiers. Que faire ?",
        "answer": "Si vous avez des difficultés à télécharger des fichiers, vérifiez d'abord..."
      },
      {
        "question": "Comment contacter le service client pour une assistance personnalisée ?",
        "answer": "Si vous avez besoin d'une assistance personnalisée, vous pouvez nous contacter à..."
      }
    ]
  },
  {
    "title": "Gestion de profil et interactions",
    "questions": [
      {
        "question": "Comment ajouter une photo de profil à mon compte ?",
        "answer": "Pour ajouter une photo de profil, connectez-vous à votre compte et allez dans..."
      },
      {
        "question": "Puis-je masquer mes activités récentes des autres utilisateurs ?",
        "answer": "Oui, vous pouvez ajuster vos paramètres de confidentialité pour masquer vos activités récentes..."
      }
    ]
  }
] as ContentType;
