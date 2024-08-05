import { LogoText } from "@/components/logos/logo-text";
import MyLink from "@/components/utilities/link";
import Balancer from "react-wrap-balancer";

export const ContentWrapper = ({
  text,
  children,
}: {
  text: {
    title: string;
    descriptionHref?: string;
    descriptionLink?: string;
    description: string;
  };
  children?: React.ReactNode;
}) => {
  return (
    <div className="m-auto w-full max-w-sm flex flex-col gap-8 animate-in">
      <LogoText className="text-5xl sm:text-6xl"/>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          <Balancer>{text.title}</Balancer>
        </h1>
        <p className="text-sm text-muted-foreground">
          <Balancer>
            {text.descriptionHref && text.descriptionLink ? (
              <>
                <MyLink
                  href={text.descriptionHref}
                  className="underline hover:text-foreground underline-offset-4"
                >
                  {text.descriptionLink}
                </MyLink>
                <span> </span>
              </>
            ) : null}
            {text.description}
          </Balancer>
        </p>
      </div>
      {children}
    </div>
  );
};
