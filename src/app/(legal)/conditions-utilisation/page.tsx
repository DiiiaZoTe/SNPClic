import { Balancer } from "react-wrap-balancer";

const TERMS_CONTENT = [
  [
    "Acceptation des Conditions",
    "En utilisant ce site web, vous acceptez de vous conformer et d'être lié par les présentes conditions d'utilisation. Si vous n'êtes pas d'accord avec l'une de ces conditions, vous n'êtes pas autorisé à utiliser ou accéder à ce site.",
  ],
  [
    "Licence d'Utilisation",
    "Sauf indication contraire, le site et son contenu sont mis à disposition sous licence AGPL v3. Vous pouvez télécharger, copier et modifier le contenu conformément à cette licence, mais vous ne pouvez pas utiliser le contenu à des fins commerciales sans autorisation explicite.",
  ],
  [
    "Restrictions",
    "Vous ne devez pas utiliser ce site pour promouvoir ou mener des activités illégales, trompeuses, malveillantes ou discriminatoires.",
  ],
  [
    "Limitation de Responsabilité",
    "Dans toute la mesure permise par la loi applicable, nous déclinons toute responsabilité pour les pertes ou dommages de quelque nature que ce soit résultant de l'utilisation de ce site.",
  ],
  [
    "Modification des Conditions",
    "Nous nous réservons le droit de modifier ces conditions à tout moment. Votre utilisation continue du site constitue votre acceptation de ces modifications.",
  ],
];

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">
        <Balancer>Conditions d'Utilisation</Balancer>
      </h1>
      <div className="flex flex-col gap-8 max-w-xl">
        {TERMS_CONTENT.map(([title, content]) => (
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
