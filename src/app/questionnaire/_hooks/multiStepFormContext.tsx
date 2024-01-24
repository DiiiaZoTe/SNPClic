// multiStepFormContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
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
}> = ({ children, stepsData }) => {
  const multiStepFormState = useMultiStepForm(stepsData);
  return (
    <MultiStepFormContext.Provider value={multiStepFormState}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
