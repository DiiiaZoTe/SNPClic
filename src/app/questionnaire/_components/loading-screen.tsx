import { Logo } from "@/components/logos/logo";
import { Loading } from "@/components/utilities/loading";
import Balancer from "react-wrap-balancer";
import { DotAnimation } from "./other";

export const LoadingScreen = () => (
  <div className="flex-grow flex flex-col gap-8 justify-center items-center animate-in-down">
    <Logo className="w-20 h-20" />
    <div className="flex flex-col gap-2 justify-center items-center">
      <p className="text-center text-lg font-semibold">
        Envoie du questionnaire
        <DotAnimation />
      </p>
      <p className="max-w-sm text-center">
        <Balancer>
          Merci de patienter un instant, nous sommes en train de finaliser
          l&apos;envoie de vos réponses.
        </Balancer>
      </p>
    </div>
    <Loading />
  </div>
);
