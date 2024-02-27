import { ReactNode } from "react";
import { TAILWIND_CONFIG, LOGO_SRC, APP_TITLE } from "./config";
import {
  Body,
  Container,
  Section,
  Tailwind,
  Img,
} from "@react-email/components";

export const Template = ({ children }: { children: ReactNode }) => {
  return (
    <Tailwind config={TAILWIND_CONFIG}>
      <Body className="bg-background text-foreground p-4 font-normal font-sans text-base">
        <Container className="p-8 bg-[#fefefe] rounded-md border border-border border-solid">
          <Section className="flex justify-center">
            <Img src={LOGO_SRC} alt={APP_TITLE} className="h-10" />
          </Section>
          {children}
        </Container>
      </Body>
    </Tailwind>
  );
};
