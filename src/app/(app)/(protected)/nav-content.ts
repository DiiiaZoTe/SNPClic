
"use client";

import { NavSectionProps } from "@/components/layout/(app)/menu/types";
import { BookPlus, LayoutDashboard, Send } from "lucide-react";

export const navItems: NavSectionProps[] = [
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