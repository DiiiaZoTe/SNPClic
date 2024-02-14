import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const loadingVariants = cva(
  "relative w-10 h-10 rounded-full animate-[spin_1.5s_cubic-bezier(0.755,_0.225,_0.29,_0.825)_infinite] after:absolute after:w-1/3 after:h-1/3 after:rounded-full after:top-[1px] after:left-1/2 after:-translate-x-1/2",
  {
    variants: {
      variant: {
        default: "bg-primary/20 after:bg-primary",
        destructive: "bg-destructive/20 after:bg-destructive",
        foreground: "bg-foreground/20 after:bg-foreground",
        background: "bg-background/20 after:bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {}

export const Loading = ({ className, variant }: LoadingProps) => {
  return (
    <div className={cn(loadingVariants({ variant }), className)}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
