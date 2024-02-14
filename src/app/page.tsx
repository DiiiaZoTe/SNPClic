import Balancer from "react-wrap-balancer";
import { HOME_CONTENT } from "./content";
import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";

export default function Home() {

  return (
    <div className="flex flex-col gap-16 max-w-xl items-center self-center grow">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1 className="text-2xl text-left">
          <Balancer
            dangerouslySetInnerHTML={{ __html: HOME_CONTENT.title }}
          ></Balancer>
        </h1>
        {HOME_CONTENT.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <Balancer
              dangerouslySetInnerHTML={{ __html: paragraph }}
            ></Balancer>
          </p>
        ))}
      </div>
      <Button asChild variant="default">
        <MyLink href="/questionnaire">Accéder au questionnaire</MyLink>
      </Button>
    </div>
  );
}
