"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "@/components/utilities/logout";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Settings, User2 } from "lucide-react";
import { NavSectionProps } from "@/components/layout/(app)/menu/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubLogo } from "@/components/logos/githubLogo";
import MyLink from "@/components/utilities/link";
import { githubConfig } from "@/config/site";
import { SubmitButton } from "@/components/utilities/submitButton";

export const HeaderMenu = ({
  email,
  navItems,
}: {
  email: string;
  navItems: NavSectionProps[];
}) => {
  return (
    <>
      <span className="hidden sm:block min-w-0 truncate">{email}</span>
      <div className="flex gap-4 sm:hidden">
        <ThemeToggle buttonVariant="outline" />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 cursor-pointer">
              <User2 className="w-5 h-5" />
              <span className="sr-only">Menu utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="[--scrollbar-size:3px] overflow-y-scroll max-h-[calc(100svh-5rem)]"
          >
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              {email}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {navItems.map(({ section, items }, index) => (
              <div key={index}>
                <DropdownMenuLabel>{section}</DropdownMenuLabel>
                {items.map(({ label, href, Icon, nextLink }) => (
                  <DropdownMenuItem key={label} asChild>
                    <MyLink
                      href={href}
                      nextLink={nextLink === undefined ? true : nextLink}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </MyLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </div>
            ))}

            <DropdownMenuLabel>Liens externes</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <MyLink href={githubConfig.repo} nextLink={false}>
                <GitHubLogo className="h-4 w-4 mr-2" />
                Source GitHub
              </MyLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <MyLink href="/parametres">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </MyLink>
            </DropdownMenuItem>
            <Logout className="w-full h-full">
              <SubmitButton
                variant="unstyled"
                className="w-full h-full px-2 py-1.5 text-destructive text-left text-sm cursor-default flex items-center hover:bg-destructive/10 relative select-none rounded-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                loader={<Loader2 className="h-4 w-4 animate-spin" />}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </SubmitButton>
            </Logout>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
