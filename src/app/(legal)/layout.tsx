import NavLinks from "@/components/navlinks";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container py-10 flex flex-col gap-10 w-full">
        <NavLinks
          links={[
            ["Mentions Légales", "/mentions-legales"],
            ["Conditions d'Utilisation", "/conditions-utilisation"],
            [
              "Politique de Protection des Données Personnelles",
              "/protection-donnees-personnelles",
            ],
          ]}
          className="grid md:grid-cols-3 md:gap-8 font-medium flex-wrap items-center w-full border border-border rounded "
          listItemClass="h-full"
          defaultLinkClass="text-foreground/60 hover:text-foreground/80 h-full py-3 px-4 flex items-center md:justify-center"
          activeLinkClass="text-primary py-3 px-4 border-b-2 h-full border-primary cursor-default flex items-center md:justify-center"
        />
        {children}
      </div>
    </>
  );
}
