import { Balancer } from "react-wrap-balancer";

import { TERMS_CONTENT } from "./content";

export const metadata = {
  title: "Conditions d'Utilisation",
  description: "Conditions d'Utilisation SNPClic",
};

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-center">
        <Balancer>Conditions d&apos;Utilisation</Balancer>
      </h1>
      <div className="flex flex-col gap-8 max-w-xl">
        {TERMS_CONTENT.map(({ title, content }, index) => (
          <div key={title} className="flex flex-row gap-6">
            <div className="flex flex-col gap-4 items-center">
              <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {index + 1}.
              </p>
              <div className="flex-1 w-[1px] border-l border-l-border" />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="text-foreground leading-7">
                <Balancer>{content}</Balancer>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
