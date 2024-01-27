// multiStepFormContext.tsx
import React, { createContext, useContext, ReactNode, RefObject } from "react";
// import { useMultiStepForm, UseMSF } from "./useMultiStepForm";
import { useMultiStepForm, UseMSF } from "./useMultiStepForm";
import { Form } from "../types";

const MultiStepFormContext = createContext<
  UseMSF | undefined
>(undefined);

export const useMultiStepFormContext = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      "useMultiStepFormContext must be used within a MultiStepFormProvider"
    );
  }
  return context;
};

export const MultiStepFormProvider: React.FC<{
  children: ReactNode;
  stepsData: Form;
  containerRef: RefObject<HTMLDivElement>;
}> = ({ children, stepsData, containerRef }) => {
  const multiStepFormState = useMultiStepForm(stepsData, containerRef);
  return (
    <MultiStepFormContext.Provider value={multiStepFormState}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
