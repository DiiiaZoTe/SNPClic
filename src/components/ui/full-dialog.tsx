import * as FullDialogPrimitive from "@radix-ui/react-alert-dialog";
import React from "react";
import { cn } from "@/lib/utils";

const FullDialog = FullDialogPrimitive.Root;
const FullDialogTrigger = FullDialogPrimitive.Trigger;
const FullDialogPortal = FullDialogPrimitive.Portal;

const FullDialogOverlay = React.forwardRef<
  React.ElementRef<typeof FullDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof FullDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <FullDialogPrimitive.Overlay
    className={cn("fixed inset-0 z-50 bg-background", className)}
    {...props}
    ref={ref}
  />
));
FullDialogOverlay.displayName = FullDialogPrimitive.Overlay.displayName;

const FullDialogContent = React.forwardRef<
  React.ElementRef<typeof FullDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof FullDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <FullDialogPortal>
    <FullDialogOverlay />
    <FullDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-screen h-screen bg-background",
        className
      )}
      {...props}
    />
  </FullDialogPortal>
));
FullDialogContent.displayName = FullDialogPrimitive.Content.displayName;


export {
  FullDialog,
  FullDialogPortal,
  FullDialogOverlay,
  FullDialogTrigger,
  FullDialogContent,
};
