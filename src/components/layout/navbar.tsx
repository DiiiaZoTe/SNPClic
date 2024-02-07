import MyLink from "@/components/utilities/link";
import { NavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/logos/logo";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { githubConfig } from "@/config/site";
import { GitHubLogo } from "@/components/logos/githubLogo";
import { SheetClose } from "../ui/sheet";

const LINKS = [
  ["Accueil", "/"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Questionnaire", "/questionnaire"],
];

export const Navbar = () => {
  return (
    <header className="container">
      <div className="flex py-6 items-center gap-8">
        <MyLink href="/" className="flex items-center gap-4">
          <h1 className="text-primary text-4xl font-bold tracking-tight">
            SNP<span className=" text-foreground"> · Clic</span>
          </h1>
          <Logo className="w-8 h-8 hidden sm:block" />
        </MyLink>
        <div className="hidden ml-auto sm:flex items-center gap-8 ">
          <NavLinks
            links={LINKS}
            className="flex gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground/70 hover:text-foreground hover:underline underline-offset-2"
          />
        </div>
        <div className="sm:hidden ml-auto flex items-center">
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="p-2">
          <MenuIcon className="w-6 h-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <SheetClose asChild>
            <MyLink href="/">
              <Logo className="w-8 h-8" />
            </MyLink>
          </SheetClose>
          <NavLinks
            links={LINKS}
            className="flex flex-col gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground/70 hover:text-foreground hover:underline underline-offset-2"
            sheetClose
          />
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-sm">Open Source</p>
          <MyLink href={githubConfig.repo}>
            <GitHubLogo className="w-4 h-4" />
            <span className="sr-only">GitHub</span>
          </MyLink>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};
