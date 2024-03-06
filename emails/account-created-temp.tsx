import { APP_TITLE } from "./config";
import {
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Template } from "./template";
import { siteConfig } from "@/config/site";

interface Props {
  password: string;
}

export const EmailAccountCreatedTempPass = ({ password }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Votre compte SNPClic a été créé. </Preview>
      <Template>
        <Section>
          <Text>Bonjour,</Text>
          <Text>
            Votre compte {APP_TITLE} a été créé par notre équipe. Veuillez
            utiliser le mot de passe temporaire suivant pour vous connecter.
            Nous vous invitons à le changer dès votre première connexion.
          </Text>
          <Section className="flex justify-center">
            <Text className="px-8 py-4 bg-background rounded-md w-fit text-2xl font-semibold border border-border border-solid">
              {password}
            </Text>
          </Section>

          <Link href={siteConfig.url + "/login"}>
            <Text className="text-primary underline w-fit">
              Aller à la page de connexion
            </Text>
          </Link>
          <Text>Cordialement,</Text>
          <Text>{`L'équipe ${APP_TITLE}`}</Text>
        </Section>
      </Template>
    </Html>
  );
};

EmailAccountCreatedTempPass.PreviewProps = {
  password: "1324567890abcdef",
};

export default EmailAccountCreatedTempPass;
