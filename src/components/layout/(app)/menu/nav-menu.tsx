"use client";

import { usePathname } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MyLink from "@/components/utilities/link";
import { Button } from "@/components/ui/button";
import { NavSectionProps } from "./types";
import { cn } from "@/lib/utils";

export const NavMenu = ({ navItems }: { navItems: NavSectionProps[] }) => {
  const currentPath = usePathname();

  return (
    <ScrollArea className="hidden sm:block whitespace-nowrap overflow-auto">
      <nav className="flex w-max px-4 gap-2 items-center py-2">
        {navItems.map(({ items }, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div key={index} className="relative flex">
              {items.map(({ label, href, Icon, nextLink }, index) => (
                <Button
                  asChild
                  variant="ghost"
                  key={index}
                  className={cn(
                    currentPath === href &&
                      "text-primary bg-background hover:bg-background hover:text-primary cursor-default"
                  )}
                  disabled={currentPath === href}
                >
                  <MyLink
                    key={label}
                    href={href}
                    nextLink={nextLink === undefined ? true : nextLink}
                    className="flex items-center gap-2"
                    disabled={currentPath === href}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </MyLink>
                </Button>
              ))}
            </div>
            {index < navItems.length - 1 && (
              <div className="border border-muted rounded h-6" />
            )}
          </div>
        ))}
      </nav>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
};
