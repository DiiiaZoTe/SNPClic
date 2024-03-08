
"use client";

import { NavSectionProps } from "@/components/layout/(app)/menu/types";
import { BarChart3, BookPlus, LayoutDashboard, Send, Target, Users } from "lucide-react";

export const userNavItems: NavSectionProps[] = [
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
      { label: "Mes soumissions", href: "/soumissions", Icon: Send, nextLink: false },
    ],
  },
];

export const adminNavItems: NavSectionProps[] = [
  ...userNavItems,
  {
    section: "Admin",
    items: [
      { label: "Utilisateurs", href: "/admin/utilisateurs", Icon: Users },
      { label: "Soumissions", href: "/admin/soumissions", Icon: Target, nextLink: false },
      { label: "Stats", href: "/admin/stats", Icon: BarChart3, nextLink: false },
    ]
  }
];