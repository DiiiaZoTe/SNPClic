import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";

const METADATA = {
  title: "FAQ",
  description: "Foire aux questions SNPClic",
  url: siteConfig.url + "/faq",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

import { Balancer } from "react-wrap-balancer";
import { FAQ_CONTENT } from "./content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  return (
    <div className="flex flex-col gap-10 w-full items-center">
      <h1 className="text-4xl font-bold tracking-tight">
        <Balancer>Foire Aux Questions</Balancer>
      </h1>
      <div className="flex flex-col gap-10 max-w-xl">
        {FAQ_CONTENT.map(({ title, questions }) => (
          <div key={title} className="flex flex-col gap-2">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              <Balancer>{title}</Balancer>
            </h2>
            <Accordion type="single" collapsible>
              {questions.map(({ question, answer }, indexQuestion) => (
                <AccordionItem value={question} key={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    {answer.split("\n").map((line, index) => (
                      <p
                        key={`${indexQuestion}-${index}`}
                        className="leading-7 text-accent-foreground"
                      >
                        <Balancer>{line}</Balancer>
                      </p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
