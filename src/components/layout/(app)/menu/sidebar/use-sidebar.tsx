"use client";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext({
  isSidebarOpen: true,
  toggleSidebar: () => {},
});
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const isTablet = useMediaQuery("(max-width: 767px)");
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  
  useEffect(() => {
    if (isTablet) {
      setIsSidebarOpen(false);
    }
  }, [isTablet]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
