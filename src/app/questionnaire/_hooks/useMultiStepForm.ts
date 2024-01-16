"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormAnswers, Form, StepDirection, Answer, StepCanStopFlowContent } from "../types";
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
  const [stopFlowGoingToStep, setStopFlowGoingToStep] = useState<number | undefined>(undefined);

  //* logic that is specific to the multiple step form below
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isStepStoppingFlow, setIsStepStoppingFlow] = useState(false);
  const [contentStepStoppingFlow, setContentStepStoppingFlow] = useState<StepCanStopFlowContent | undefined>(undefined);
  const [formStoppedReason, setFormStoppedReason] = useState<string | undefined>(undefined);

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
      //! for perf reasons, we may say the steps questions flat map to not process it every time...
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

  /** validates the current step and returns a list representing the validity of the steps in order */
  const validateCurrentStep = useCallback(async () => {
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
    return currentValidSteps;
  }, [form, currentStepData, currentStep]);

  //* The step helpers
  /**
   * Internal use only, use this to set the current step
   * as it updates the visited steps, and atom for access outside of react context
   */
  const safeSetCurrentStep = async (step: number, direction: StepDirection) => {
    // validate the current step
    validateCurrentStep();

    // check if we can stop the flow
    if (step > currentStep && checkStepsCanStopFlow(currentStep, step)) return;

    // otherwise, set the current step
    normalSetCurrentStep(step, direction)
  };

  /**
   * Internal use only, use this to set the current step without any validation etc...
   */
  const normalSetCurrentStep = (step: number, direction: StepDirection) => {
    cancelStepStoppingFlow();
    setDirection(direction);
    setCurrentStep(step);
    setVisitedSteps((visited) => {
      const updatedVisited = [...visited];
      updatedVisited[step - 1] = true;
      return updatedVisited;
    });
    if (isFormSubmitted) setIsFormSubmitted(false);
  }

  /** go to next step if possible */
  const goToNextStep = () => {
    // can't go past the last step
    if (currentStep === numberOfSteps) return;
    // otherwise, go to the next step
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

  /** go to recap step 
   * @param bypassFutureInvalidSteps skips validation of steps passed the current
   */
  const goToRecap = async (bypassFutureInvalidSteps = false, stopFlowReason?: string) => {
    // was last step valid?
    let currentValidSteps = await validateCurrentStep();
    if (bypassFutureInvalidSteps) {
      currentValidSteps = currentValidSteps.slice(0, currentStep);
    }
    // get the first non valid step and go to it
    const firstInvalidStep = currentValidSteps.findIndex((valid) => !valid);
    if (firstInvalidStep !== -1) {
      goTo(firstInvalidStep + 1);
      return;
    }
    // otherwise, submit the form
    if (stopFlowReason) setFormStoppedReason(stopFlowReason);
    setIsFormSubmitted(true);
  }

  /** continue after trying stopping flow */
  const continueAfterStopFlow = () => {
    if (stopFlowGoingToStep === undefined) return;
    // since this only goes forward, we check if a step after the
    // current up to the one we are going to can stop the flow
    if(checkStepsCanStopFlow(currentStep + 1, stopFlowGoingToStep)) return;
    normalSetCurrentStep(stopFlowGoingToStep, "forward");
  }

  /** cancel the step stopping flow */
  const cancelStepStoppingFlow = useCallback(() => {
    setIsStepStoppingFlow(false);
    setContentStepStoppingFlow(undefined);
    setStopFlowGoingToStep(undefined);
    setFormStoppedReason(undefined);
  }, []);

  /** user submitted the form */
  const onSubmitCallback = async () => {
    if (currentStep < numberOfSteps) {
      goToNextStep();
      return;
    }
    goToRecap()
  };

  /** check if current step can stop flow and sets modal content*/
  const checkStepsCanStopFlow = (fromStep: number, toStep: number) => {
    setStopFlowGoingToStep(toStep);
    for (let i = fromStep; i < toStep; i++) {
      const stepToEvaluate = data[i - 1];
      for (const condition of stepToEvaluate.stopFlowCondition || []) {
        const conditionEvaluated = evaluateCondition(condition.condition, form.getValues());
        if (conditionEvaluated) {
          setIsStepStoppingFlow(true);
          setContentStepStoppingFlow(condition.content);
          setDirection("forward");
          setCurrentStep(i);
          return true;
        }
      }
    }
    return false;
  }

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
        continueAfterStopFlow,
        goToRecap,
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
      stopFlow: {
        isStepStoppingFlow,
        setIsStepStoppingFlow,
        contentStepStoppingFlow,
        setContentStepStoppingFlow,
        cancelStepStoppingFlow,
        formStoppedReason,
        setFormStoppedReason,
      }
    }
  };
};