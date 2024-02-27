import { APP_TITLE } from "./config";
import { Head, Html, Preview, Section, Text } from "@react-email/components";
import { Template } from "./template";

interface Props {
  code: string;
}

export const VerificationCodeEmail = ({ code }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Vérification de votre adresse e-mail. Code: {code}</Preview>
      <Template>
        <Section>
          <Text>Bonjour,</Text>
          <Text>
            Votre compte {APP_TITLE} a été créé. Pour vérifier votre adresse
            e-mail, veuillez entrer le code suivant:
          </Text>
          <Section className="flex justify-center">
            <Text className="px-8 py-4 bg-background rounded-md w-fit tracking-widest text-2xl font-semibold border border-border border-solid">
              {code}
            </Text>
          </Section>
          <Text>Cordialement,</Text>
          <Text>{`L'équipe ${APP_TITLE}`}</Text>
        </Section>
      </Template>
    </Html>
  );
};

VerificationCodeEmail.PreviewProps = {
  code: "123456",
};

export default VerificationCodeEmail;
