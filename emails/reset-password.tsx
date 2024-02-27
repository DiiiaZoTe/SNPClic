import { APP_TITLE } from "./config";
import {
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import { Template } from "./template";

interface Props {
  link: string;
}

export const ResetPasswordEmail = ({ link }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe</Preview>
      <Template>
        <Section>
          <Text>Bonjour,</Text>
          <Text>
            Quelqu&apos;un a récemment demandé un changement de mot de passe
            pour votre compte {APP_TITLE}. Si vous êtes à l&apos;origine de
            cette demande , vous pouvez définir un nouveau mot de passe ici:
          </Text>
          <Section className="flex justify-center">
            <Button
              className="bg-primary text-background px-4 py-3 rounded-md"
              href={link}
            >
              Réinitialiser le mot de passe
            </Button>
          </Section>
          <Text>
            Si vous ne souhaitez pas changer votre mot de passe ou si vous
            n&apos;avez pas demandé cela, ignorez et supprimez simplement cette
            email.
          </Text>
          <Text>
            Pour garder votre compte sécurisé, veuillez ne pas transférer cet
            e-mail.
          </Text>
          <Text>Cordialement,</Text>
          <Text>{`L'équipe ${APP_TITLE}`}</Text>
        </Section>
      </Template>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  link: "https://example.com/reset-password?token=123456",
};

export default ResetPasswordEmail;
