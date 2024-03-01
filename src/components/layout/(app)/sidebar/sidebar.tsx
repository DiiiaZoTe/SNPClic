"use client";

import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

import { ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubLogo } from "@/components/logos/githubLogo";
import { githubConfig } from "@/config/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "./use-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarNavItemProps, SidebarNavSectionProps } from "./types";

export const Sidebar = ({
  sidebarItems,
}: {
  sidebarItems: SidebarNavSectionProps[];
}) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(max-width: 767px)");

  if (isMobile) return null;

  return (
    <aside
      className={cn(
        "relative z-50 h-full md bg-background border-r border-muted flex flex-col gap-4 [--scrollbar-size:5px] transition-[width] duration-500",
        isSidebarOpen ? "w-60 lg:w-72 xl:w-80" : "w-[4.5rem]",
        isTablet ? "absolute" : ""
      )}
    >
      <button
        className="absolute z-[999] bg-background top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-1 border border-muted rounded-full"
        onClick={() => toggleSidebar()}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4 -translate-x-[1px]" />
        ) : (
          <ChevronRight className="w-4 h-4 translate-x-[1px]" />
        )}
      </button>
      <ScrollArea className="px-4 relative">
        <nav className="flex flex-col gap-4 flex-1 pt-4 mb-2">
          {sidebarItems.map(({ section, items }, index) => (
            <SidebarNavSection key={index} section={section} items={items} />
          ))}
        </nav>
        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-b from-transparent to-background" />
      </ScrollArea>
      <div className="mt-auto px-4 pb-4 flex flex-col gap-2">
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
        <Separator />
        <div className="flex flex-col">
          <SidebarNavItem
            label="GitHub"
            href={githubConfig.repo}
            Icon={GitHubLogo}
          />
          <div className="flex gap-2 items-center">
            <ThemeToggle triggerClassName="min-w-10 min-h-10 w-10 px-2.5 py-2" />
            <span
              className={cn(
                "min-w-0 truncate transition-[width] duration-500",
                isSidebarOpen ? "w-full" : "w-0"
              )}
            >
              Thème
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarNavSection = ({ section, items }: SidebarNavSectionProps) => {
  const currentPath = usePathname();
  const { isSidebarOpen } = useSidebar();
  return (
    <div className="space-y-2">
      {section && (
        <h2
          className={cn(
            "text-sm text-foreground/60 font-medium min-w-0 truncate transition-[width] duration-500",
            isSidebarOpen ? "w-full" : "w-10"
          )}
        >
          {section}
        </h2>
      )}
      <div className="flex flex-col">
        {items.map(({ label, href, Icon, className }) => (
          <SidebarNavItem
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

const SidebarNavItem = ({
  label,
  href,
  Icon,
  className,
  active,
}: SidebarNavItemProps) => {
  const { isSidebarOpen } = useSidebar();
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "justify-start text-base font-normal gap-4 px-2.5 transition-[width] duration-500",
        className,
        active &&
          "bg-primary/5 text-primary hover:bg-primary/5 hover:text-primary ",
        isSidebarOpen ? "w-full" : "w-10 h-10"
      )}
      disabled={active}
    >
      <MyLink href={href}>
        <Icon className="w-5 h-5 min-w-fit" />
        <span className="min-w-0 truncate">{label}</span>
      </MyLink>
    </Button>
  );
};
