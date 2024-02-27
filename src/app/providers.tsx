import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";

import { SessionProvider } from "@/lib/auth/session-context";
import { validateRequest } from "@/server/auth/validate-request";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  return (
    <SessionProvider value={session}>
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
    </SessionProvider>
  );
}
