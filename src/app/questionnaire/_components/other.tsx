"use client";

import { ReactNode, useEffect, useState } from "react";
import { ButtonVariantsType } from "@/components/ui/button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const DotAnimation = ({ duration = 1500 }) => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((prevDotCount) => (prevDotCount % 3) + 1);
    }, Math.floor(duration / 3));

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [duration]);

  return (
    <span className="inline">
      {Array.from({ length: 3 }, (_, index) => (
        <span
          key={index}
          className={index < dotCount ? "opacity-100" : "opacity-0"}
        >
          .
        </span>
      ))}
    </span>
  );
};

export const errorToast = ({
  action,
  title,
  description,
  buttonLabel,
  buttonVariant,
}: {
  action?: () => void;
  title?: string;
  description?: string;
  buttonLabel: string;
  buttonVariant?: ButtonVariantsType;
}) => {
  toast.custom((t) => (
    <div className="flex flex-col gap-4">
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

export const ExtraSection = ({
  handleSubmit,
  isLoading,
  isSuccess,
  isError,
  title,
  description,
  error,
  buttonLabel,
  children,
}: {
  handleSubmit?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  title: string;
  description: string;
  error?: string;
  buttonLabel?: string;
  children?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 w-full">
    <p className="text-xl font-bold leading-none tracking-tight">{title}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
    {isError && (
      <p className="text-destructive text-sm font-medium">
        {error ||
          "Une erreur est survenue. Veuillez réessayer dans quelques secondes."}
      </p>
    )}
    {children ?? (
      <Button
        onClick={handleSubmit ?? (() => {})}
        className="w-fit max-w-full ml-auto group"
        disabled={isSuccess || isLoading}
      >
        <span className="truncate min-w-0">{buttonLabel ?? "Continuer"}</span>
        <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
      </Button>
    )}
  </div>
);
