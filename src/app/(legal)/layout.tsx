import {NavLinks} from "@/components/layout/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-10 w-full items-center">
      <NavLinks
        links={[
          ["Mentions Légales", "/mentions-legales"],
          ["Conditions d'Utilisation", "/conditions-utilisation"],
          ["Politique de Confidentialité", "/politique-confidentialite"],
        ]}
        className="grid md:grid-cols-3 bg-card md:gap-8 font-medium flex-wrap items-center w-full border border-muted rounded-xl"
        listItemClass="h-full w-full flex justify-center"
        defaultLinkClass="text-foreground/70 hover:text-foreground h-full py-3 px-4 flex items-center justify-center"
        activeLinkClass="text-primary py-3 px-4 border-b-2 h-full text-center border-primary cursor-default flex items-center justify-center"
      />
      {children}
    </div>
  );
}
