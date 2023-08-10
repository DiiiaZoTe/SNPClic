import { ModeToggle } from "./mode-toggle";

import { NavLinks } from "@/components/navlinks/nav-links";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
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
      <div className="flex py-4 items-center">
        <h1 className="text-primary text-4xl font-bold tracking-tight">
          SNP<span className=" text-foreground"> · Clic</span>
        </h1>
        <div className="hidden ml-auto sm:flex items-center gap-8 ">
          <NavLinks
            links={LINKS}
            className="flex gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground/60 hover:text-foreground/80"
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
        <NavLinks
          links={LINKS}
          className="flex flex-col gap-8 font-medium"
          activeLinkClass="text-primary cursor-default"
          defaultLinkClass="text-foreground/60 hover:text-foreground/80"
        />
        <ModeToggle />
      </SheetContent>
    </Sheet>
  );
};
