"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormAnswers, Form, StepDirection, Answer } from "../types";
import { flattenFormData, getFormDefaultValues, getStepAnswers, getStepZodSchema } from "../_utils/utils";
import { evaluateCondition } from "../_utils/conditions";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getDefaultStore, useAtom } from "jotai";
import { formAnswersAtom } from "../_hooks/atom";

export type UseMSF = ReturnType<typeof useMultiStepForm>;

export const useMultiStepForm = (data: Form) => {

  /** number of steps in the form */
  const numberOfSteps = data.length;

  //* The step state
  const [currentStep, setCurrentStep] = useState(1);
  // const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [visitedSteps, setVisitedSteps] = useState<boolean[]>([true]);
  const [validSteps, setValidSteps] = useState<boolean[]>([...Array(numberOfSteps).fill(false)]);

  //* logic that is specific to the multiple step form below
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  /** currentStepData */
  const currentStepData = data[currentStep - 1];

  //* The form state and initializers
  /** zod schema of the current step */
  const currentStepSchema = useMemo(
    () => getStepZodSchema(currentStepData),
    [currentStepData]
  );
  /** default values of the form */
  const defaultValues = useMemo(
    () => getFormDefaultValues(data),
    [data]
  );
  /** the current step form */
  const form = useForm<z.infer<typeof currentStepSchema>>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: defaultValues,
  });
  /** set the default values in the form to our atom */
  useEffect(() => {
    getDefaultStore().set(formAnswersAtom, form.getValues())
  });

  //* form logic
  /** resets a question's answer */
  const resetAnswer = useCallback((questionKey: string) => {
    // console.log("resetting", questionKey);
    form.setValue(questionKey, defaultValues[questionKey]);
  }, [form, defaultValues]);

  const [hiddenQuestions, setHiddenQuestions] = useState<string[]>([]);
  // inital run to hide questions
  useEffect(() => {
    const questions = flattenFormData(data);
    const toHide = <string[]>[];
    questions.forEach((question) => {
      if (!question.displayCondition) return;
      const displayEvaluated = evaluateCondition(question.displayCondition, getDefaultStore().get(formAnswersAtom));
      if (!displayEvaluated) {
        toHide.push(question.key);
      }
    });
    setHiddenQuestions(toHide);
  }, [data, defaultValues, currentStep]);

  useEffect(() => {
    const watching = form.watch((values, { name: questionKey, type: eventType }) => {
      const formValues = values as FormAnswers;
      getDefaultStore().set(formAnswersAtom, formValues);
      if (eventType !== "change") return;
      const question = currentStepData.questions.find((q) => q.key === questionKey);
      if (!question) return;
      if (question.dependents === undefined || question.dependents.length === 0) return;
      const dependents = data.flatMap((step) => step.questions).filter((q) => question.dependents?.includes(q.key));
      const toHide = <string[]>[];
      dependents.forEach((dependent) => {
        if (!dependent.displayCondition) return;
        const displayEvaluated = evaluateCondition(dependent.displayCondition, formValues);
        if (!displayEvaluated) {
          resetAnswer(dependent.key);
          toHide.push(dependent.key);
        }
      });
      setHiddenQuestions(toHide);
    });

    return () => {
      watching.unsubscribe();
    }
  }, [form, currentStepData, data, resetAnswer]);

  //* The step helpers
  /**
   * Internal use only, use this to set the current step
   * as it updates the visited steps, and atom for access outside of react context
   */
  const safeSetCurrentStep = async (step: number, direction: StepDirection) => {
    const { errors } = await form.control._executeSchema([
      ...currentStepData.questions.map((question) => question.key)
    ]);
    const wasPreviousStepValid = Object.keys(errors).length === 0;
    setValidSteps((steps) => {
      const updatedSteps = [...steps];
      updatedSteps[currentStep - 1] = wasPreviousStepValid;
      return updatedSteps;
    });
    setDirection(direction);
    setCurrentStep(step);
    setVisitedSteps((visited) => {
      const updatedVisited = [...visited];
      updatedVisited[step - 1] = true;
      return updatedVisited;
    });
    if (isFormSubmitted) setIsFormSubmitted(false);
  };

  /** go to next step if possible */
  const goToNextStep = () => {
    // can't go past the last step
    if (currentStep === numberOfSteps) return;
    // otherwise, go to the next step
    setDirection("forward");
    safeSetCurrentStep(currentStep + 1, "forward");
  };

  /** go to previous step if possible */
  const goToPreviousStep = () => {
    // can't go past the first step
    if (currentStep === 1) return;
    // otherwise, go to the previous step
    safeSetCurrentStep(isFormSubmitted ? currentStep : currentStep - 1, "backward");
  };

  /** go to a specific step if possible */
  const goTo = (toStep: number) => {
    if (toStep < 1 || toStep > numberOfSteps) return;
    if (toStep === currentStep && !isFormSubmitted) return;
    // set the direction
    safeSetCurrentStep(toStep, toStep > currentStep ? "forward" : "backward");
  };

  /** user submitted the form */
  const onSubmitCallback = async () => {
    if (currentStep < numberOfSteps) {
      goToNextStep();
      return;
    }
    // was last step valid?
    const { errors } = await form.control._executeSchema([
      ...currentStepData.questions.map((question) => question.key)
    ]);
    const wasStepValid = Object.keys(errors).length === 0;
    let currentValidSteps: boolean[] = [];
    setValidSteps((steps) => {
      const updatedSteps = [...steps];
      updatedSteps[currentStep - 1] = wasStepValid;
      currentValidSteps = updatedSteps;
      return updatedSteps;
    });
    // get the first non valid step and go to it
    const firstInvalidStep = currentValidSteps.findIndex((valid) => !valid);
    if (firstInvalidStep !== -1) {
      goTo(firstInvalidStep + 1);
      return;
    }
    // otherwise, submit the form
    setIsFormSubmitted(true);
  };

  return {
    data: {
      form: data,
      currentStep: data[currentStep - 1]
    },
    stepper: {
      currentStep,
      numberOfSteps,
      direction,
      validSteps,
      move: {
        next: goToNextStep,
        previous: goToPreviousStep,
        goTo,
      },
      is: {
        firstStep: currentStep === 1,
        lastStep: currentStep === numberOfSteps,
        visited: (step: number) => visitedSteps[step - 1] || false,
        valid: (step: number) => validSteps[step - 1] || false,
      },
      highestStepVisited: visitedSteps.length,
    },
    form,
    questions: {
      hidden: hiddenQuestions,
      isHidden: (questionKey: string) => hiddenQuestions.includes(questionKey),
      resetAnswer,
    },
    answers: {
      form: () => form.getValues(),
      currentStep: () => getStepAnswers(data[currentStep - 1], form.getValues()),
      step: (step: number) => getStepAnswers(data[step - 1], form.getValues()),
      question: (questionKey: string) => form.getValues(questionKey),
    },
    submission: {
      isFormSubmitted,
      setIsFormSubmitted,
      onSubmitCallback,
    }
  };
};