// useMultiStepForm.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormAnswers, Form, StepDirection, CanStopFlowContent, QuestionInfoCondition, Question, Step } from "../types";
import { evaluateCondition } from "../_utils/conditions";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getDefaultStore } from "jotai";
import { formAnswersAtom } from "./atom";
import { getStepZodSchema } from "./schemas";

export type UseMSF = ReturnType<typeof useMultiStepForm>;

export const useMultiStepForm = (data: Form) => {
  /** number of steps in the form */
  const numberOfSteps = data.length;

  //******************************************************
  //*                 The stepper states
  //******************************************************

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [visitedSteps, setVisitedSteps] = useState<boolean[]>([true]);
  const [validSteps, setValidSteps] = useState<boolean[]>([...Array(numberOfSteps).fill(false)]);

  //******************************************************
  //*                 The submission states
  //******************************************************

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  //******************************************************
  //*                 The control flow states
  //******************************************************

  const [stopFlowGoingToStep, setStopFlowGoingToStep] = useState<number | undefined>(undefined);
  const [isStoppingFlow, setIsStoppingFlow] = useState(false);
  const [contentStoppingFlow, setContentStoppingFlow] = useState<CanStopFlowContent | undefined>(undefined);
  const [formStoppedReason, setFormStoppedReason] = useState<{
    reason: string;
    questionKey?: string;
  } | undefined>(undefined);

  //******************************************************
  //*                 The Form logic states
  //******************************************************

  const [hiddenQuestions, setHiddenQuestions] = useState<string[]>([]);

  //******************************************************
  //*                 The Form data variables
  //******************************************************

  const currentStepData = useMemo(() => data[currentStep - 1], [data, currentStep]);
  const flattenForm = useMemo(() => flattenFormData(data), [data]);

  //******************************************************
  //*                 The Form initialization
  //******************************************************

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

  /** set the default values in the form to our atom for zod verification */
  useEffect(() => {
    getDefaultStore().set(formAnswersAtom, form.getValues())
  });

  //*****************************************************
  //*                 The form logic + validation
  //******************************************************

  /** resets a question's answer */
  const resetAnswer = useCallback((questionKey: string) => {
    form.setValue(questionKey, defaultValues[questionKey]);
  }, [form, defaultValues]);


  // Effect to set the hidden questions when step changes
  useEffect(() => {
    const toHide = <string[]>[];
    flattenForm.forEach((question) => {
      if (!question.displayCondition) return;
      const displayEvaluated = evaluateCondition(question.displayCondition, getDefaultStore().get(formAnswersAtom));
      if (!displayEvaluated) {
        toHide.push(question.key);
      }
    });
    setHiddenQuestions(toHide);
  }, [flattenForm, defaultValues, currentStep]);

  // Effect to watch for answer changes and hide questions accordingly
  useEffect(() => {
    const watching = form.watch((values, { name: questionKey, type: eventType }) => {
      const formValues = values as FormAnswers;
      getDefaultStore().set(formAnswersAtom, formValues);
      if (eventType !== "change") return;
      const question = currentStepData.questions.find((q) => q.key === questionKey);
      if (!question) return;
      if (question.dependents === undefined || question.dependents.length === 0) return;
      //! for perf reasons, we may say the steps questions flat map to not process it every time...
      const dependents = flattenForm.filter((q) => question.dependents?.includes(q.key));
      const toHide = checkDependentsDisplayCondition(formValues, dependents);
      toHide.forEach((questionKey) => {
        resetAnswer(questionKey);
      });
      setHiddenQuestions(toHide);
    });

    return () => {
      watching.unsubscribe();
    }
  }, [form, currentStepData, flattenForm, resetAnswer]);

  /**
   * @param step validate the step or the entire form if no step is provided
   */
  const validateFormAnswers = useCallback(async (step?: number, bypassPassedCurrent = false) => {
    // validate schema
    const stepsToValidate = step ? data[step - 1].questions : flattenForm;
    const { errors } = await form.control._executeSchema([
      ...stepsToValidate.map((question) => question.key)
    ]);
    const wasStepValid = Object.keys(errors).length === 0;
    let currentValidSteps: boolean[] = [];
    // all the steps
    if (!bypassPassedCurrent) {
      setValidSteps((steps) => {
        const updatedSteps = [...steps];
        updatedSteps[currentStep - 1] = wasStepValid;
        currentValidSteps = updatedSteps;
        return updatedSteps;
      });
      return currentValidSteps;
    }

    // up to the current step
    setValidSteps((steps) => {
      currentValidSteps = Array.from({ length: steps.length }, (_, i) => {
        if (i < currentStep - 1) return steps[i];
        else if (i === currentStep - 1) return wasStepValid;
        return false;
      });
      return currentValidSteps;
    });
    setVisitedSteps((visited) => {
      return Array.from({ length: visited.length }, (_, index) => (
        index <= currentStep - 1
      ));
    });
    return currentValidSteps;
  }, [form, data, flattenForm, setValidSteps, currentStep]);

  //******************************************************
  //*                 The stepper logic
  //******************************************************

  /**
   * Internal use only, use this to set the current step
   * as it updates the visited steps, and atom for access outside of react context
   */
  const internalSetCurrentStep = async (step: number, direction: StepDirection) => {
    // validate the current step
    await validateFormAnswers(currentStep);
    // check if we can stop the flow
    if (step > currentStep && stepTryStopFlow(currentStep, step)) return;
    // otherwise, set the current step
    internalBasicSetCurrentStep(step, direction)
  };

  /**
   * Internal use only, use this to set the current step without any validation etc...
   */
  const internalBasicSetCurrentStep = (step: number, direction: StepDirection) => {
    cancelStopFlow();
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
    internalSetCurrentStep(currentStep + 1, "forward");
  };

  /** go to previous step if possible */
  const goToPreviousStep = () => {
    // can't go past the first step
    if (currentStep === 1) return;
    // otherwise, go to the previous step
    internalSetCurrentStep(isFormSubmitted ? currentStep : currentStep - 1, "backward");
  };

  /** go to a specific step if possible */
  const goToStep = (toStep: number) => {
    if (toStep < 1 || toStep > numberOfSteps) return;
    if (toStep === currentStep && !isFormSubmitted) return;
    // set the direction
    internalSetCurrentStep(toStep, toStep > currentStep ? "forward" : "backward");
  };

  /** go to recap step 
   * @param bypassFutureInvalidSteps skips validation of steps passed the current
   */
  const goToRecap = async (bypassFutureInvalidSteps = false, stopFlowReason?: { reason: string, questionKey?: string }) => {
    // was last step valid?
    const currentValidSteps = bypassFutureInvalidSteps
      ? (await validateFormAnswers(currentStep, true)).slice(0, currentStep)
      : await validateFormAnswers(currentStep);

    // get the first non valid step and go to it
    // ! maybe we will have to change the order here if stopping flow but required question after terminator button in the same step
    const firstInvalidStep = currentValidSteps.findIndex((valid) => !valid);
    if (firstInvalidStep !== -1) {
      goToStep(firstInvalidStep + 1);
      return;
    }
    // submit the form if we are not stopping the flow
    if (!stopFlowReason) {
      setIsFormSubmitted(true);
      return;
    }

    // set stopping flow reason
    setFormStoppedReason(stopFlowReason);
    setIsFormSubmitted(true);
    if (!!!stopFlowReason.questionKey) return;
    // below if button stopped flow
    // make sure we set the terminator button question key to true
    form.setValue(stopFlowReason.questionKey, true);
    // here we should reset all the answer after the question
    const indexQuestionKey = flattenForm.findIndex((question) => question.key === stopFlowReason.questionKey);
    const questionsToReset = flattenForm.slice(indexQuestionKey + 1);
    questionsToReset.forEach((question) => {
      resetAnswer(question.key);
    });
  };

  //******************************************************
  //*                 The submission logic
  //******************************************************

  /** user submitted the form */
  const onSubmitCallback = async () => {
    if (currentStep < numberOfSteps) {
      goToNextStep();
      return;
    }
    goToRecap()
  };

  //******************************************************
  //*                 The control flow logic
  //******************************************************

  /** continue after trying stopping flow */
  const continueModalStopFlow = () => {
    console.log(stopFlowGoingToStep);
    if (stopFlowGoingToStep === undefined) return;
    // since this only goes forward, we check if a step after the
    // current up to the one we are going to can stop the flow
    if (stepTryStopFlow(currentStep + 1, stopFlowGoingToStep)) return;
    internalBasicSetCurrentStep(stopFlowGoingToStep, "forward");
  }

  /** cancel the step stopping flow */
  const cancelStopFlow = useCallback(() => {
    setIsStoppingFlow(false);
    setContentStoppingFlow(undefined);
    setStopFlowGoingToStep(undefined);
    if (formStoppedReason?.questionKey)
      form.setValue(formStoppedReason.questionKey!, false);
    setFormStoppedReason(undefined);
  }, [formStoppedReason, form]);

  const buttonTryStopFlow = (question: Question<"terminatorButton">) => {
    if (!question) return;
    setIsStoppingFlow(true);
    setContentStoppingFlow({ ...question.stopFlowContent, questionKey: question.key });
    setStopFlowGoingToStep(currentStep + 1); //! subject to change
    setDirection("forward");
  }

  /** check if current step can stop flow and sets modal content*/
  const stepTryStopFlow = (fromStep: number, toStep: number) => {
    setStopFlowGoingToStep(toStep);
    for (let i = fromStep; i < toStep; i++) {
      const stepToEvaluate = data[i - 1];
      const stopCondition = stepToEvaluate.stopFlowCondition?.find(condition =>
        evaluateCondition(condition.condition, form.getValues())
      );
      if (stopCondition) {
        setIsStoppingFlow(true);
        setContentStoppingFlow(stopCondition.content);
        setDirection("forward");
        setCurrentStep(i);
        return true;
      }
    }
    return false;
  };

  //******************************************************
  //*                 The return object
  //******************************************************

  return {
    data: {
      form: data,
      currentStep: currentStepData,
      flattenForm
    },
    stepper: {
      currentStep,
      numberOfSteps,
      direction,
      validSteps,
      goTo: {
        next: goToNextStep,
        previous: goToPreviousStep,
        step: goToStep,
        recap: goToRecap,
      },
      is: {
        firstStep: currentStep === 1,
        lastStep: currentStep === numberOfSteps,
        visited: (step: number) => visitedSteps[step - 1] || false,
        valid: (step: number) => validSteps[step - 1] || false,
      },
    },
    form,
    questions: {
      hidden: hiddenQuestions,
      isHidden: (questionKey: string) => hiddenQuestions.includes(questionKey),
      resetAnswer,
      checkQuestionInfoCondition,
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
    },
    controlFlow: {
      stopping: {
        isStopping: isStoppingFlow,
        setIsStopping: setIsStoppingFlow,
        content: contentStoppingFlow,
        setContent: setContentStoppingFlow,
        cancelStopFlow,
        continueModalStopFlow,
      },
      stopped: {
        formStoppedReason,
        setFormStoppedReason,
      },
      try: {
        buttonTryStopFlow,
        stepTryStopFlow,
      },
    }
  }
};



//******************************************************
//*                 Utility functions
//******************************************************

/** Get the questions that are defined after the specified one */
const getQuestionsAfterQuestionKey = (questionKey: string, flattenForm: Question<any>[]) => {
  const questionIndex = flattenForm.findIndex((question) => question.key === questionKey);
  if (questionIndex === -1) return [];
  return flattenForm.slice(questionIndex + 1);
}



/** evaluate the info condition of a question and return the info if true */
const checkQuestionInfoCondition = (formAnswers: FormAnswers, infoConditions?: QuestionInfoCondition) => {
  if (!infoConditions) return undefined;
  for (const infoCondition of infoConditions) {
    const infoConditionEvaluated = evaluateCondition(infoCondition.condition, formAnswers);
    if (!infoConditionEvaluated) continue;
    return infoCondition.info;
  }
}

/** check if dependents should be hidden */
const checkDependentsDisplayCondition = (formAnswers: FormAnswers, dependents: Question<any>[]) => {
  const toHide = <string[]>[];
  dependents.forEach((dependent) => {
    if (!dependent.displayCondition) return;
    const displayEvaluated = evaluateCondition(dependent.displayCondition, formAnswers);
    if (!displayEvaluated) {
      toHide.push(dependent.key);
    }
  });
  return toHide;
}

/** Get the form data as a flat array of questions */
export const flattenFormData = (data: Form) => {
  return data.flatMap((step) => step.questions);
}
/** Get the default values for the form */
export const getFormDefaultValues = (data: Form): FormAnswers => {
  return data.reduce((acc, step) => {
    step.questions.forEach((question) => {
      acc[question.key] = question.defaultAnswer;
    });
    return acc;
  }, {} as FormAnswers);
}

/** Get the answers for a specific step */
export const getStepAnswers = (stepData: Step, formAnswers: FormAnswers) => {
  return stepData.questions.reduce((acc, question) => {
    acc[question.key] = formAnswers[question.key];
    return acc;
  }, {} as FormAnswers);
}