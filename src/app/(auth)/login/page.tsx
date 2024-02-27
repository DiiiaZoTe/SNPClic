import { ContentWrapper } from "../content-wrapper";
import { LoginForm } from "./form";

export default function Login() {
  return (
    <ContentWrapper
      text={{
        title: "Bienvenue!",
        description: "Connectez-vous pour accéder à votre compte.",
      }}
    >
      <LoginForm />
    </ContentWrapper>
  );
}
