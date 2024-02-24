import {
  Body,
  Head,
  Html,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";

export const TestEmail = ({ input }: { input: string }) => {
  return (
    <Html>
      <Head />
      <Preview>This is the preview of the email</Preview>
      <Tailwind>
        <Body className="font-sans text-base text-foreground bg-background">
          <Text>{input}</Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

TestEmail.PreviewProps = {
  input: "Hello, world!",
};

export default TestEmail;
