import MyLink from "@/components/utilities/link";
import { NavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/logos/logo";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Send,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { githubConfig } from "@/config/site";
import { GitHubLogo } from "@/components/logos/githubLogo";
import { SheetClose } from "@/components/ui/sheet";
import { LogoText } from "@/components/logos/logo-text";

import { validateRequest } from "@/server/auth/validate-request";

const LINKS = [
  ["Accueil", "/"],
  ["Contact", "/contact"],
];

export const Navbar = async () => {
  const { user } = await validateRequest();

  return (
    <header className="container">
      <div className="flex py-6 items-center gap-8">
        <MyLink href="/" className="flex items-center gap-4">
          <LogoText />
          <Logo className="w-8 h-8 hidden sm:block" />
        </MyLink>
        <div className="hidden ml-auto sm:flex items-center gap-8 ">
          <NavLinks
            links={LINKS}
            className="flex gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground hover:text-foreground hover:underline underline-offset-4"
          />
          {user && <UserMenu email={user.email} />}
          {!user && <LoginButton />}
        </div>
        <div className="sm:hidden ml-auto flex items-center gap-8">
          {user && <UserMenu email={user.email} mobile />}
          <MobileNavbar links={LINKS} userConnected={!!user} />
        </div>
      </div>
    </header>
  );
};

const MobileNavbar = ({
  links,
  userConnected,
}: {
  links: string[][];
  userConnected: boolean;
}) => {
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
            links={links}
            className="flex flex-col gap-8 font-medium"
            activeLinkClass="text-primary cursor-default"
            defaultLinkClass="text-foreground hover:text-foreground hover:underline underline-offset-4"
            sheetClose
          />
        </div>
        <div className="w-full space-y-8">
          {!userConnected && <LoginButton className="w-full" />}
          <div className="flex gap-4 items-center">
            <p className="text-sm">Open Source</p>
            <MyLink href={githubConfig.repo}>
              <GitHubLogo className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </MyLink>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const LoginButton = ({ className }: { className?: string }) => (
  <Button variant="black" asChild>
    <MyLink href="/login" className={className} nextLink={false}>
      Se connecter
    </MyLink>
  </Button>
);

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "@/components/utilities/logout";

const UserMenu = ({
  email,
  mobile = false,
}: {
  email: string;
  mobile?: boolean;
}) => {
  return (
    <DropdownMenu>
      {mobile && (
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-2 cursor-pointer">
            <User2 className="w-6 h-6" />
            <span className="sr-only">Menu utilisateur</span>
          </Button>
        </DropdownMenuTrigger>
      )}
      {!mobile && (
        <DropdownMenuTrigger>
          <span className="cursor-pointer font-medium text-foreground hover:text-foreground hover:underline underline-offset-4 flex gap-2 items-center">
            {email.split("@")[0]}
            <User2 className="w-4 h-4" />
          </span>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent>
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className="h-4 w-4 mr-2" />
          Mes soumissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Logout className="w-full h-full">
            <button
              type="submit"
              className="w-full h-full px-2 py-1.5 text-destructive text-left cursor-default flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </Logout>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
