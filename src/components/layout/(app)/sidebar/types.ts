import { LucideIcon } from "lucide-react";

export type SidebarNavItemProps = {
  label: string;
  href: string;
  Icon: LucideIcon | any;
  className?: string;
  active?: boolean;
};

export type SidebarNavSectionProps = {
  section: string;
  items: SidebarNavItemProps[];
};
