"use client";

import { ReactNode, forwardRef } from "react";
// @ts-ignore
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends ButtonProps {
  loader?: ReactNode;
  loading?: boolean;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, children, loader, loading, disabled, ...props }, ref) => {
    const { pending } = useFormStatus(); 
    const isLoading = loading === undefined ? pending : loading;
    return (
      <Button
        type="submit"
        ref={ref}
        {...props}
        className={className}
        disabled={disabled !== undefined ? disabled : isLoading}
      >
        {isLoading ? loader : children}
      </Button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
