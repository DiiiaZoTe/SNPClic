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
import { LogOut, Settings, User2 } from "lucide-react";
import { NavSectionProps } from "@/components/layout/(app)/menu/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubLogo } from "@/components/logos/githubLogo";
import MyLink from "@/components/utilities/link";
import { githubConfig } from "@/config/site";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 cursor-pointer">
              <User2 className="w-5 h-5" />
              <span className="sr-only">Menu utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              {email}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {navItems.map(({ section, items }, index) => (
              <div key={index}>
                <DropdownMenuLabel>{section}</DropdownMenuLabel>
                {items.map(({ label, href, Icon }) => (
                  <DropdownMenuItem key={label} asChild>
                    <MyLink href={href}>
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
              <MyLink href={githubConfig.repo}>
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
              <button
                type="submit"
                className="w-full h-full px-2 py-1.5 text-destructive text-left text-sm cursor-default flex items-center hover:bg-destructive/10 relative select-none rounded-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </button>
            </Logout>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};