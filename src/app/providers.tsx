import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        {children}
        <Toaster />
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
