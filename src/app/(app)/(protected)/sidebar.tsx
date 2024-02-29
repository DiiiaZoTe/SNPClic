"use client";

import {
  BookPlus,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Send,
  Settings,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubLogo } from "@/components/logos/githubLogo";
import { githubConfig } from "@/config/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import { use, useState } from "react";
import { usePathname } from "next/navigation";

const sidebarNav: SidebarNavSection[] = [
  {
    section: "Navigation",
    items: [{ label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard }],
  },
  {
    section: "Questionnaire",
    items: [
      {
        label: "Questionnaire",
        href: "/questionnaire",
        Icon: BookPlus,
      },
      { label: "Mes soumissions", href: "/soumissions", Icon: Send },
    ],
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={cn(
        "border-r border-muted flex flex-col gap-4 [--scrollbar-size:5px]",
        isOpen ? "w-16" : "w-60"
      )}
    >
      <ScrollArea className="px-4 relative">
        <nav className="flex flex-col gap-4 flex-1 pt-4 mb-2">
          {sidebarNav.map(({ section, items }, index) => (
            <SidebarNavSection key={index} section={section} items={items} />
          ))}
        </nav>
        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-b from-transparent to-background" />
      </ScrollArea>
      <div className="mt-auto px-4 pb-4 flex flex-col gap-4">
        <SidebarNavSection
          section="Mon compte"
          items={[
            {
              label: "Paramètres",
              href: "/parametres",
              Icon: Settings,
            },
            {
              label: "Déconnexion",
              href: "/logout",
              Icon: LogOut,
              className:
                "text-destructive hover:text-destructive hover:bg-destructive/10",
            },
          ]}
        />
        <div className="flex gap-4 justify-center">
          <Button variant="ghost" size="icon">
            <MyLink href={githubConfig.repo}>
              <GitHubLogo className="w-5 h-5" />
            </MyLink>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export type SidebarNavSection = {
  section: string;
  items: SidebarNavItem[];
};

export const SidebarNavSection = ({ section, items }: SidebarNavSection) => {
  const currentPath = usePathname();

  return (
    <div className="space-y-2">
      {section && (
        <h2 className="text-sm text-foreground/60 font-medium">{section}</h2>
      )}
      <div className="flex flex-col">
        {items.map(({ label, href, Icon, className }) => (
          <SidebarNavLink
            key={label}
            label={label}
            href={href}
            Icon={Icon}
            className={className}
            active={currentPath === href}
          />
        ))}
      </div>
    </div>
  );
};

export type SidebarNavItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
  className?: string;
  active?: boolean;
};
const SidebarNavLink = ({
  label,
  href,
  Icon,
  className,
  active,
}: SidebarNavItem) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "justify-start w-full text-left text-base font-normal gap-4",
        className,
        active &&
          "bg-primary/5 text-primary hover:bg-primary/5 hover:text-primary"
      )}
      disabled={active}
    >
      <MyLink href={href}>
        <Icon className="w-5 h-5" />
        <span className="min-w-0 truncate">{label}</span>
      </MyLink>
    </Button>
  );
};
