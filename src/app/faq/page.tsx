import { Balancer } from "react-wrap-balancer";

import FAQ_CONTENT from "./content.json";
import type { ContentType } from "./content-type";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const content = FAQ_CONTENT as ContentType;

  return (
    <div className="flex flex-col gap-10 w-full items-center">
      <h1 className="text-4xl font-bold tracking-tight">
        <Balancer>Foire Aux Questions</Balancer>
      </h1>
      <div className="flex flex-col gap-10 max-w-xl">
        {content.map(({ title, questions }) => (
          <div key={title} className="flex flex-col gap-2">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
              <Balancer>{title}</Balancer>
            </h2>
            <Accordion type="single" collapsible>
              {questions.map(({ question, answer }) => (
                <AccordionItem value={question} key={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    {answer.split("\n").map((line) => (
                      <p className="leading-7 text-accent-foreground">
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
