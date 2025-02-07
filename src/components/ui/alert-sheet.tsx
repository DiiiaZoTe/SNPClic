"use client";

import * as React from "react";
import * as AlertSheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const AlertSheet = AlertSheetPrimitive.Root;

const AlertSheetTrigger = AlertSheetPrimitive.Trigger;

const AlertSheetClose = AlertSheetPrimitive.Close;

const AlertSheetPortal = AlertSheetPrimitive.Portal

const AlertSheetOverlay = React.forwardRef<
  React.ElementRef<typeof AlertSheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertSheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertSheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertSheetOverlay.displayName = AlertSheetPrimitive.Overlay.displayName;

const AlertsheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface AlertSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertSheetPrimitive.Content>,
    VariantProps<typeof AlertsheetVariants> {}

const AlertSheetContent = React.forwardRef<
  React.ElementRef<typeof AlertSheetPrimitive.Content>,
  AlertSheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <AlertSheetPortal>
    <AlertSheetOverlay />
    <AlertSheetPrimitive.Content
      ref={ref}
      onInteractOutside={(event) => event.preventDefault()}
      className={cn(AlertsheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <AlertSheetPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </AlertSheetPrimitive.Close>
    </AlertSheetPrimitive.Content>
  </AlertSheetPortal>
));
AlertSheetContent.displayName = AlertSheetPrimitive.Content.displayName;

const AlertSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertSheetHeader.displayName = "AlertSheetHeader";

const AlertSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertSheetFooter.displayName = "AlertSheetFooter";

const AlertSheetTitle = React.forwardRef<
  React.ElementRef<typeof AlertSheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertSheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertSheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
AlertSheetTitle.displayName = AlertSheetPrimitive.Title.displayName;

const AlertSheetDescription = React.forwardRef<
  React.ElementRef<typeof AlertSheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertSheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertSheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertSheetDescription.displayName = AlertSheetPrimitive.Description.displayName;

export {
  AlertSheet,
  AlertSheetPortal,
  AlertSheetOverlay,
  AlertSheetTrigger,
  AlertSheetClose,
  AlertSheetContent,
  AlertSheetHeader,
  AlertSheetFooter,
  AlertSheetTitle,
  AlertSheetDescription,
};
