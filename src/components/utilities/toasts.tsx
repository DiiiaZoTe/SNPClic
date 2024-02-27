"use client";

import { ButtonVariantsType } from "@/components/ui/button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type WithoutAction = {
  title?: string;
  description?: string;
};

type WithAction = {
  action: () => void;
  buttonLabel: string;
  buttonVariant: ButtonVariantsType;
};

type ErrorToastProps = WithoutAction &
  ({ actionButton?: never } | { actionButton?: WithAction });

export const errorToast = ({
  title,
  description,
  actionButton,
}: ErrorToastProps) => {
  const { action, buttonLabel, buttonVariant } = actionButton || {};
  toast.custom((t) => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-base mb-1 font-medium tracking-tight">
          {title || "Une erreur est survenue"}
        </p>
        <p className="text-sm leading-relaxed">
          {description ||
            "Veuillez réessayer. Si le problème persiste, veuillez nous contacter."}
        </p>
      </div>
      {action && (
        <Button
          onClick={() => {
            toast.dismiss(t);
            action();
          }}
          variant={buttonVariant}
          className="w-fit max-w-full ml-auto text-sm"
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  ));
};
