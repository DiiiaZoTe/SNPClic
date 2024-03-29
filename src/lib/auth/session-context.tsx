"use client";

import { createContext, useContext, ReactNode } from "react";
import { validateRequestSSR } from "@/server/auth/validate-request";

type ContextType = Awaited<ReturnType<typeof validateRequestSSR>>;

export const SessionContext = createContext<ContextType>({
  session: null,
  user: null,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider: React.FC<{
  children: ReactNode;
  value: ContextType;
}> = ({ children, value }) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
