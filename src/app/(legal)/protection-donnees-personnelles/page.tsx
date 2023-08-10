import Balancer from "react-wrap-balancer";

const CONTACT_EMAIL = "katarina.vencel@hotmail.fr";

const PRIVACY_CONTENT = [
  [
    "Aucune Collecte de Données Personnelles",
    "Nous ne collectons aucune information personnelle sur les visiteurs de notre site. Vous pouvez utiliser notre site sans fournir aucune information personnelle.",
  ],
  [
    "Pas de Cookies",
    "Nous n'utilisons pas de cookies ou d'autres technologies de suivi pour collecter des informations sur votre utilisation de notre site.",
  ],
  [
    "Liens vers d'Autres Sites",
    "Notre site peut contenir des liens vers d'autres sites qui ne sont pas exploités par nous. Si vous cliquez sur un lien vers un site tiers, vous serez dirigé vers le site de ce tiers. Nous vous conseillons vivement d'examiner la politique de confidentialité de chaque site que vous visitez. Nous n'avons aucun contrôle sur, et n'assumons aucune responsabilité pour le contenu, les politiques de confidentialité ou les pratiques des sites ou services de tiers.",
  ],
  [
    "Sécurité",
    "Bien que nous n'enregistrions pas de données personnelles, nous nous efforçons de protéger la sécurité de notre site web. Cependant, aucune méthode de transmission sur Internet, ou méthode de stockage électronique, n'est 100% sécurisée et nous ne pouvons garantir sa sécurité absolue.",
  ],
  [
    "Changements à cette Politique",
    "Nous pouvons mettre à jour notre politique de confidentialité de temps en temps. Nous vous aviserons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.",
  ],
  [
    "Contact",
    `Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse email: ${CONTACT_EMAIL}.`,
  ],
];

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">
        <Balancer>Politique de Protection des Données Personnelles</Balancer>
      </h1>
      <div className="flex flex-col gap-8 max-w-xl">
        {PRIVACY_CONTENT.map(([title, content]) => (
          <div key={title}>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-foreground leading-7 [&:not(:first-child)]:mt-4">
              {content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
