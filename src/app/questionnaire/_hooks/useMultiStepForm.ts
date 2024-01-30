// useMultiStepForm.ts
"use client";

import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { FormAnswers, Form, StepDirection, CanStopFlowContent, QuestionInfoCondition, Question, Step, StopFlowReason } from "../types";
import { evaluateCondition } from "../_utils/conditions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getDefaultStore } from "jotai";
import { formAnswersAtom } from "./atom";
import { getStepZodSchema } from "./schemas";
import { scrollToViewIfNeeded } from "../_utils/utils";

export type UseMSF = ReturnType<typeof useMultiStepForm>;

export const useMultiStepForm = (data: Form, containerRef: RefObject<HTMLDivElement>) => {
  /** number of steps in the form */
  const numberOfSteps = data.length;

  //******************************************************
  //*                 The stepper states
  //******************************************************

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  // const [visitedSteps, setVisitedSteps] = useState<StepVisited[]>(["visited", ...Array(numberOfSteps - 1).fill("notVisited")]);
  const [visitedSteps, setVisitedSteps] = useState<boolean[]>([true, ...Array(numberOfSteps - 1).fill(false)]);
  const [skippedSteps, setSkippedSteps] = useState<boolean[]>([true, ...Array(numberOfSteps - 1).fill(false)]);

  //******************************************************
  //*                 The submission states
  //******************************************************

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [validSteps, setValidSteps] = useState<boolean[]>([...Array(numberOfSteps).fill(false)]);

  //******************************************************
  //*                 The control flow states
  //******************************************************

  // const [stopFlowGoingToStep, setStopFlowGoingToStep] = useState<number | undefined>(undefined);
  const [isStoppingFlow, setIsStoppingFlow] = useState(false);
  const [contentStoppingFlow, setContentStoppingFlow] = useState<CanStopFlowContent | undefined>(undefined);
  const [formStoppedReason, setFormStoppedReason] = useState<StopFlowReason>(undefined);
  // this helps keep track of the steps that called continue flow during the stopping flow
  // if we go back to a step that called continue flow, and we hit next instead,
  // then we should remove the step from the array
  const [stepCalledContinueFlow, setStepCalledContinueFlow] = useState<number[]>([]);


  //******************************************************
  //*                 The Form logic states
  //******************************************************

  const [hiddenQuestions, setHiddenQuestions] = useState<string[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);

  //******************************************************
  //*          The Form data variables + states
  //******************************************************

  const currentStepData = useMemo(() => data[currentStep - 1], [data, currentStep]);
  const flattenForm = useMemo(() => flattenFormData(data), [data]);

  //******************************************************
  //*                 The Form initialization
  //******************************************************

  /** zod schemas of each step */
  const stepSchemas = useMemo(() =>
    data.map((step) => getStepZodSchema(step)), [data]
  );

  /** zod schema of the current step */
  const currentStepSchema = useMemo(() =>
    stepSchemas[currentStep - 1], [currentStep, stepSchemas]
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

  /** resets a step's answers */
  const resetStepAnswers = useCallback((step: number) => {
    const stepData = data[step - 1];
    stepData.questions.forEach((question) => {
      resetAnswer(question.key);
    });
  }, [data, resetAnswer]);

  // Effect to set the hidden questions when step changes
  useEffect(() => {
    const toHide = <string[]>[];
    flattenForm.forEach((q) => {
      const question = q.question;
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
      const dependents = flattenForm.filter((q) => question.dependents?.includes(q.key)).map((q) => q.question);
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
   * validate the answers of the current step. 
   * A skipped step is considered valid.
   * Can provide a questionKey 
   */
  const validateStepAnswers = (step: number, includedQuestions?: string[]): {
    success: boolean;
    errors?: any
  } => {
    const stepData = data[step - 1];
    const stepSchema = stepSchemas[step - 1];
    const stepAnswers = getStepAnswers(stepData, form.getValues());
    const stepValidation = stepSchema.safeParse(stepAnswers);
    if (!!!includedQuestions) {
      return { success: stepValidation.success || skippedSteps[step - 1] };
    }
    // @ts-ignore if no error then it will be undefined so valid
    //! you may want to get all the issues not just the first one... then return false with the issues to set later?
    const stepValidationErrors = stepValidation.error?.issues?.filter((issue: any) => includedQuestions.includes(issue.path[0]));
    if (stepValidationErrors?.length === 0) return {
      success: true
    };
    return {
      success: false,
      errors: stepValidationErrors
    }
  };

  /** a step is valid if it's valid or skipped */
  const getValidSteps = useCallback(() => {
    return validSteps.map((valid, index) => valid || skippedSteps[index]);
  }, [validSteps, skippedSteps]);

  //******************************************************
  //*                 The stepper logic
  //******************************************************

  /**
   * Internal use only, use this to set the current step without any validation etc...
   */
  const internalBasicSetStep = (toStep: number, direction: StepDirection) => {
    cancelStopFlow();
    setDirection(direction);
    setCurrentStep(toStep);
    scrollToViewIfNeeded(containerRef);
    setSkippedQuestions((prev) => { // remove the skipped questions of the step we are going to
      const stepQuestions = data[toStep - 1].questions.map((question) => question.key);
      return prev.filter((skipped) => !stepQuestions.includes(skipped));
    })
    form.clearErrors();
    if (isFormSubmitted) setIsFormSubmitted(false);
  }

  /** go to next step if possible */
  const goToNextStep = () => {
    // can't go past the last step
    if (currentStep === numberOfSteps) return;
    if (isFormSubmitted) return;
    // if the current step is not valid, don't go to next step
    const {success: isCurrentValid} = validateStepAnswers(currentStep);
    if (!isCurrentValid) return;

    // check if the step can stop the flow
    const stepStoppedFlow = stepTryStopFlow(currentStep);
    if (stepStoppedFlow) return;

    // we need to get all the skipped steps following the next step (not current since we reset next anyway)
    // if the current was a continue after stop flow
    // we do this to invalidate those steps as we can now access them
    const followingSkippedStep = <number[]>[];
    const currentWasContinueFlow = stepCalledContinueFlow.includes(currentStep);
    if (currentWasContinueFlow) {
      for (let i = currentStep + 1; i < skippedSteps.length; i++) {
        if (!skippedSteps[i]) break;
        followingSkippedStep.push(i);
      }
    }

    // logic go to next step
    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = true;
      newValids[currentStep] = false;
      // invalidate the skipped steps after the current step
      for (const skippedStep of followingSkippedStep) {
        newValids[skippedStep] = false;
      }
      return newValids;
    });
    setVisitedSteps((prev) => {
      const newVisited = [...prev];
      newVisited[currentStep - 1] = true;
      newVisited[currentStep] = true;
      // invalidate the skipped steps after the current step
      for (const skippedStep of followingSkippedStep) {
        newVisited[skippedStep] = false;
      }
      return newVisited;
    });
    setSkippedSteps((prev) => {
      const newSkipped = [...prev];
      newSkipped[currentStep - 1] = false;
      newSkipped[currentStep] = false;
      // invalidate the skipped steps after the current step
      for (const skippedStep of followingSkippedStep) {
        newSkipped[skippedStep] = false;
      }
      return newSkipped;
    });
    // if the current was a continue after stop flow, then remove it.
    if (currentWasContinueFlow)
      setStepCalledContinueFlow((prev) => prev.filter((step) => step !== currentStep));
    // go to next step
    internalBasicSetStep(currentStep + 1, "forward");
  };

  /** go to previous step if possible */
  const goToPreviousStep = () => {
    // can't go past the first step
    if (currentStep === 1) return;
    // we go back to the step that submitted the form
    if (isFormSubmitted) return internalBasicSetStep(currentStep, "backward");

    // if the current step is not valid, don't go to next step
    const { success: isCurrentValid } = validateStepAnswers(currentStep);

    // get the first step before the current one that is skipped
    const skippedSubset = skippedSteps.slice(0, currentStep - 1);
    let goToStep = currentStep - 1;
    for (let i = skippedSubset.length - 1; i >= 0; i--) {
      if (!skippedSubset[i]) {
        goToStep = i + 1;
        break;
      }
    }

    // logic go to previous step
    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = isCurrentValid;
      newValids[goToStep - 1] = false;
      return newValids;
    });
    setVisitedSteps((prev) => {
      const newVisited = [...prev];
      newVisited[currentStep - 1] = true;
      newVisited[goToStep - 1] = true;
      return newVisited;
    });
    internalBasicSetStep(goToStep, "backward");
  };

  /** go to a specific step if possible */
  const goToStep = (toStep: number) => {
    if (toStep < 1 || toStep > numberOfSteps) return;
    if (toStep === currentStep && !isFormSubmitted) return;
    // logic go to step
    // if the current step is not valid, don't go to next step
    const { success: isCurrentValid } = validateStepAnswers(currentStep);
    // logic go to previous step
    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = isCurrentValid;
      newValids[toStep - 1] = false; // invalidated the step we go to
      return newValids;
    });
    internalBasicSetStep(toStep, toStep > currentStep ? "forward" : "backward");
  };

  /** go to recap step */
  const goToRecap = () => {

    const { success: isCurrentValid } = validateStepAnswers(currentStep);
    if (!isCurrentValid) return;
    if (isFormSubmitted) return;

    // go to first invalid step
    const validStepsWithCurrent = getValidSteps();
    validStepsWithCurrent[currentStep - 1] = isCurrentValid;
    const firstInvalidStep = validStepsWithCurrent.findIndex((valid) => !valid);
    if (firstInvalidStep !== -1) return goToStep(firstInvalidStep + 1);

    // logic go to recap
    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = true;
      return newValids;
    });
    setIsFormSubmitted(true);
    scrollToViewIfNeeded(containerRef);
  };


  //******************************************************
  //*                 The submission logic
  //******************************************************

  /** user submitted the form */
  const onSubmitCallback = () => {
    if (currentStep < numberOfSteps)
      return goToNextStep();
    goToRecap()
  };

  //******************************************************
  //*                 The control flow logic
  //******************************************************

  /** try to stop the flow from a button */
  const buttonTryStopFlow = (question: Question<"terminatorButton">) => {
    if (!question) return;
    if (!question.stopFlowContent) return;
    form.setValue(question.key, true);
    stoppingFlowSetter(question.stopFlowContent, question.key);
  }

  /** try to stop the flow from a step */
  const stepTryStopFlow = (step: number) => {
    const stepData = data[step - 1];
    const stopCondition = stepData.stopFlowCondition?.find(condition =>
      evaluateCondition(condition.condition, form.getValues())
    )?.content;
    if (stopCondition === undefined) return false;
    stoppingFlowSetter(stopCondition);
    return true;
  };

  /** continue after trying stopping flow */
  const continueInStopFlow = (toStep?: number, triggerByQuestionKey?: string) => {
    if (currentStep === numberOfSteps) goToRecap();
    const goToStep = toStep ?? currentStep + 1;
    if (goToStep < currentStep) return;

    const { success: isCurrentValid, errors } = validateStepAnswers(
      currentStep,
      triggerByQuestionKey ? getStepQuestionsBefore(currentStepData, triggerByQuestionKey).map((question) => question.key) : undefined
    );
    if (!isCurrentValid) {
      // set the errors in the form to show the user and cancel stop flow
      errors.forEach((error: any) => {
        form.setError(error.path[0], { type: "manual", message: error.message });
      });
      cancelStopFlow();
      return;
    };

    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = true;
      return newValids;
    });
    setSkippedSteps((prev) =>
      prev.map((skipped, index) => skipped || currentStep - 1 < index && index < goToStep - 1)
    );
    setVisitedSteps((prev) =>
      prev.map((visited, index) => (
        index === currentStep - 1 || index === goToStep - 1
          ? true
          : currentStep - 1 < index && index < goToStep - 1
            ? false
            : visited
      ))
    );
    // we should also set skipped all the questions that are:
    // - after the triggerByQuestionKey of the current step or first question of next step
    // - in the steps after the current step up to the goToStep
    // - keep the skipped questions that are before the current step and after the goToStep
    const indexQuestionKey = triggerByQuestionKey
      ? flattenForm.findIndex((question) => question.key === triggerByQuestionKey) // question that triggered the stop flow
      : flattenForm.findIndex((question) => question.step === currentStep + 1); // first question of next step
    const firstQuestionKeyGoToStep = data[goToStep - 1].questions[0].key;
    const indexFirstGoToStepQuestion = flattenForm.findIndex((question) => question.key === firstQuestionKeyGoToStep);
    const questionsToSkip = flattenForm.slice(indexQuestionKey + 1, indexFirstGoToStepQuestion);
    setSkippedQuestions((prev) => {
      const keepSkipped = prev.filter((skipped) => {
        const indexSkipped = flattenForm.findIndex((question) => question.key === skipped);
        return indexSkipped < indexQuestionKey || indexSkipped > indexFirstGoToStepQuestion;
      });
      return [...keepSkipped, ...questionsToSkip.map((question) => question.key)];
    });
    setStepCalledContinueFlow((prev) => [...prev, currentStep]);
    internalBasicSetStep(goToStep, "forward");
  }

  /** cancel the step stopping flow */
  const cancelStopFlow = () => {
    // when we just canceled the stop flow, reset all steps passed current
    // this will only happen the first time we cancel the stop flow
    if (formStoppedReason) {
      skippedSteps.forEach((skipped, index) => {
        if (index < currentStep) return;
        if (!skipped) return;
        resetStepAnswers(index + 1);
      });
      setValidSteps((prev) => prev.map((valid, index) => index >= currentStep ? false : valid));
      setVisitedSteps((prev) => prev.map((visited, index) => index >= currentStep ? false : visited));
      setSkippedSteps((prev) => prev.map((skipped, index) => index >= currentStep ? false : skipped));
    }
    // same thing we also reset the terminator button value
    if (formStoppedReason?.questionKey)
      form.setValue(formStoppedReason.questionKey!, false);

    // may need to reset the terminator buttons
    setIsStoppingFlow(false);
    setContentStoppingFlow(undefined);
    setFormStoppedReason(undefined);
  };

  /** 
   * Check if the stop flow content can be bypassed,
   * otherwise set the flow to stopping and set modal content
   */
  const stoppingFlowSetter = (stopFlowContent: CanStopFlowContent, questionKey?: string) => {
    const reason = stopFlowContent.bypassModalStopReason;
    // base case we don't bypass modal
    if (reason === undefined) {
      setIsStoppingFlow(true);
      setContentStoppingFlow({ ...stopFlowContent, questionKey });
      setDirection("forward");
      return;
    }
    if (stopFlowContent.continueToStep) return continueInStopFlow(stopFlowContent.continueToStep);
    goToRecapStoppingFlow({ reason: reason === true ? "" : reason, questionKey });
  }

  /** go to recap step */
  const goToRecapStoppingFlow = (stopFlowReason: StopFlowReason) => {
    if (!stopFlowReason) return;
    //! may need another validation here as step could have invalid answers when using terminator
    const { success: isCurrentValid, errors } = validateStepAnswers(
      currentStep,
      stopFlowReason.questionKey ? getStepQuestionsBefore(currentStepData, stopFlowReason.questionKey).map((question) => question.key) : undefined
    );
    if (!isCurrentValid) {
      // set the errors in the form to show the user and cancel stop flow
      errors.forEach((error: any) => {
        form.setError(error.path[0], { type: "manual", message: error.message });
      });
      cancelStopFlow();
      return;
    };
    if (isFormSubmitted) return;

    // go to first invalid step, only checking up to the current step
    let validStepsWithCurrent = getValidSteps();
    validStepsWithCurrent = validStepsWithCurrent.slice(0, currentStep);
    validStepsWithCurrent[currentStep - 1] = isCurrentValid;
    const firstInvalidStep = validStepsWithCurrent.findIndex((valid) => !valid);
    if (firstInvalidStep !== -1) return goToStep(firstInvalidStep + 1);

    // logic go to recap
    setValidSteps((prev) => {
      const newValids = [...prev];
      newValids[currentStep - 1] = true;
      return newValids;
    });
    const newSkipped = skippedSteps.map((skipped, index) =>
      index < currentStep ? skipped : true
    );
    const newVisited = newSkipped.map((skipped, index) =>
      index < currentStep - 1 ? visitedSteps[index] : !skipped
    );
    setVisitedSteps(newVisited);
    setSkippedSteps(newSkipped);
    setIsFormSubmitted(true);
    scrollToViewIfNeeded(containerRef);
    setFormStoppedReason(stopFlowReason);
    // reset answers of all skipped steps
    newSkipped.forEach((skipped, index) => {
      if (!skipped) return;
      resetStepAnswers(index + 1);
    });

    if (!!!stopFlowReason.questionKey) return;
    // below if button stopped flow
    // make sure we set the terminator button question key to true
    form.setValue(stopFlowReason.questionKey, true);
    // here we should reset and skip all the answer after the question
    const indexQuestionKey = flattenForm.findIndex((question) => question.key === stopFlowReason.questionKey);
    const questionsToSkip = flattenForm.slice(indexQuestionKey + 1);
    questionsToSkip.forEach((question) => {
      resetAnswer(question.key);
    });
    setSkippedQuestions((prev) => [...prev, ...questionsToSkip.map((question) => question.key)]);
  };

  //******************************************************
  //*                 The return object
  //******************************************************

  return {
    data: {
      form: data,
      currentStep: currentStepData,
      step: (step: number) => data[step - 1],
      flattenForm
    },
    stepper: {
      currentStep,
      numberOfSteps,
      direction,
      validSteps,
      visitedSteps,
      skippedSteps,
      scrollToView: () => scrollToViewIfNeeded(containerRef),
      goTo: {
        next: goToNextStep,
        previous: goToPreviousStep,
        step: goToStep,
        recap: goToRecap,

      },
      is: {
        firstStep: currentStep === 1,
        lastStep: currentStep === numberOfSteps,
        valid: (step: number) => validSteps[step - 1] || false,
        visited: (step: number) => visitedSteps[step - 1] || false,
        skipped: (step: number) => skippedSteps[step - 1] || false,
      },
    },
    form,
    questions: {
      hidden: hiddenQuestions,
      isHidden: (questionKey: string) => hiddenQuestions.includes(questionKey),
      isSkipped: (questionKey: string) => skippedQuestions.includes(questionKey),
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
        continueModalStopFlow: continueInStopFlow,
      },
      stopped: {
        formStoppedReason,
        setFormStoppedReason,
        goToRecap: goToRecapStoppingFlow,
      },
      try: {
        buttonTryStopFlow,
      },
    }
  }
};

//******************************************************
//*                 Utility functions
//******************************************************

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
  // return data.flatMap((step) => step.questions);
  return data.flatMap((step, index) =>
    step.questions.map(question => ({
      step: index + 1, // Assuming you want step numbers to start from 1
      key: question.key,
      question: question // This will include the entire question object. If you want just a specific property, adjust accordingly.
    }))
  );
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

export const getStepQuestionsBefore = (stepData: Step, questionKey: string) => {
  const index = stepData.questions.findIndex((question) => question.key === questionKey);
  return stepData.questions.slice(0, index + 1);
}