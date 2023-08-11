import { ModeToggle } from "./mode-toggle";

import NavLinks from "@/components/navlinks";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  ["Acceuil", "/"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];

export const Navbar = () => {
  return (
    <header className="container">
      <div className="flex py-4 items-center gap-8">
        <div className="flex items-center gap-4">
          <h1 className="text-primary text-4xl font-bold tracking-tight">
            SNP<span className=" text-foreground"> · Clic</span>
          </h1>
          <Logo className="w-8 h-8 hidden sm:block" />
        </div>
        <div className="hidden ml-auto sm:flex items-center gap-8 ">
          <NavLinks
            links={LINKS}
            className="flex gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground/70 hover:text-foreground"
          />
          <ModeToggle />
        </div>
        <div className="sm:hidden ml-auto flex items-center">
          <MobileNavbar />
        </div>
      </div>
      <Separator />
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
          <Logo className="w-8 h-8" />
          <NavLinks
            links={LINKS}
            className="flex flex-col gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground/70 hover:text-foreground"
          />
        </div>
        <ModeToggle />
      </SheetContent>
    </Sheet>
  );
};
