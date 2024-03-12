"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import MyLink from "@/components/utilities/link";

export const BackButton = ({
  backLink,
  nextLink = true,
}: {
  backLink: string;
  nextLink?: boolean;
}) => {
  return (
    <Button asChild variant="linkForeground">
      <MyLink
        href={backLink}
        className="group w-fit relative sm:absolute top-0 -left-4 sm:top-8 sm:left-8"
        nextLink={nextLink}
      >
        <ChevronLeft className="stroke-2 mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Retour
      </MyLink>
    </Button>
  );
};
