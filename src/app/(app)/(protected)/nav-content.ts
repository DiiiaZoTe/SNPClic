
"use client";

import { SidebarNavSectionProps } from "@/components/layout/(app)/sidebar/types";
import { BookPlus, LayoutDashboard, Send } from "lucide-react";

export const sidebarItems: SidebarNavSectionProps[] = [
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