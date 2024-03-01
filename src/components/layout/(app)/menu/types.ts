import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type NavItemProps = {
  label: string;
  href: string;
  Icon: LucideIcon | any;
  className?: string;
  active?: boolean;
  Component?: ReactNode;
};

export type NavSectionProps = {
  section: string;
  items: NavItemProps[];
};
