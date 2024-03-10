import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ChangePasswordForm } from "./change-password";

const METADATA = {
  title: "Paramètres",
  description: "Paramètres de compte SNPClic",
  url: siteConfig.url + "/paremetres",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default function Page() {
  return (
    <TitleWrapper title="Paramètres">
      <Section
        title="Changez votre mot de passe"
        className="mx-auto w-full max-w-xs"
      >
        <ChangePasswordForm />
      </Section>
    </TitleWrapper>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}
const Section = ({
  title,
  description,
  children,
  className,
  ...props
}: SectionProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
};
