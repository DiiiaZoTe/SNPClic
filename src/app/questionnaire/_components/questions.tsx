"use client";

import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import type { Answer, Question, QuestionType } from "../types";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Info } from "lucide-react";
import { Body } from "./body";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type UseFormType = UseFormReturn<
  {
    [x: string]: Answer;
  },
  any,
  undefined
>;

export const FieldWrapper = ({
  question,
  label,
  form,
  render,
  itemClassName,
  labelClassName,
  formMessage = true,
  infoMessage = true,
}: {
  question: Question<QuestionType>;
  label?: string;
  form: UseFormType;
  render: (field: ControllerRenderProps) => React.ReactNode;
  itemClassName?: string;
  labelClassName?: string;
  formMessage?: boolean;
  infoMessage?: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  let infoMessageContent: string | undefined = undefined;
  if (infoMessage)
    infoMessageContent = useMSF.questions.checkQuestionInfo(
      question.infoCondition
    );
  return (
    <FormField
      name={question.key}
      control={form.control}
      render={({ field }) => (
        <FormItem id={`${question.key}_item`} className="flex flex-col gap-2">
          <div className={itemClassName ?? "flex flex-col gap-2"}>
            <FormLabel className="flex flex-col gap-2">
              <div
                className={
                  labelClassName ??
                  "font-medium text-base flex flex-row gap-2 items-center"
                }
              >
                {label ? (
                  label
                ) : (
                  <>
                    <span dangerouslySetInnerHTML={{ __html: question.text }} />
                    {question.isRequired ? (
                      <span className="text-red-500">*</span>
                    ) : null}
                    {question.popupInfo ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" className="p-0">
                            <Info className="w-4 h-4 stroke-primary" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>{question.popupInfo}</p>
                        </PopoverContent>
                      </Popover>
                    ) : null}
                  </>
                )}
              </div>
              {question.description ? (
                <span
                  className="text-sm text-foreground/60"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
              ) : null}
            </FormLabel>
            <FormControl>{render(field)}</FormControl>
          </div>
          {infoMessage && infoMessageContent ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: infoMessageContent,
              }}
            />
          ) : null}
          {formMessage ? <FormMessage /> : null}
        </FormItem>
      )}
    />
  );
};

export const BooleanQuestion = ({
  question,
}: {
  question: Question<"boolean">;
}) => {
  const useMSF = useMultiStepFormContext();
  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      itemClassName="flex flex-col xs:flex-row gap-4 justify-between xs:items-center"
      render={(field) => (
        <Switch
          className="self-end xs:self-auto"
          checked={field.value}
          onCheckedChange={(newValue) => {
            field.onChange(newValue);
          }}
        />
      )}
    />
  );
};

export const MultiChoiceQuestion = ({
  question,
}: {
  question: Question<"multiChoice">;
}) => {
  const useMSF = useMultiStepFormContext();
  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      render={() => (
        <>
          {question.options?.map((option, index) => (
            <FieldWrapper
              key={index}
              question={question}
              label={option.label}
              form={useMSF.form}
              itemClassName="flex flex-row items-center gap-4 space-y-0 bg-background border-muted border rounded-sm px-4 py-3"
              labelClassName="font-normal leading-5"
              formMessage={false}
              infoMessage={false}
              render={(field) => (
                <Checkbox
                  className="ml-auto"
                  checked={field.value?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (field.value === undefined) field.value = [];
                    const newValue = checked
                      ? [...field?.value, option.value]
                      : field.value?.filter(
                          (value: string) => value !== option.value
                        );
                    field.onChange(newValue);
                  }}
                />
              )}
            />
          ))}
        </>
      )}
    />
  );
};

export const MultiSelectQuestion = ({
  question,
}: {
  question: Question<"multiSelect">;
}) => {
  const useMSF = useMultiStepFormContext();
  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      render={(field) => (
        <FancyMultiSelect
          options={question.options!}
          value={question.options!.filter((option) =>
            field.value?.includes(option.value)
          )}
          placeholder={question.placeholder ?? "Sélectionner les réponses"}
          allSelectedPlaceholder="Vous avez tout sélectionné"
          onSelectionChange={(value) => {
            const newValue = value.map((item) => item.value);
            field.onChange(newValue);
          }}
        />
      )}
    />
  );
};

export const SelectQuestion = ({
  question,
}: {
  question: Question<"select">;
}) => {
  const useMSF = useMultiStepFormContext();
  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      render={(field) => (
        <Select
          defaultValue={field.value}
          onValueChange={(newValue) => {
            field.onChange(newValue);
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={question.placeholder ?? "Sélectionner une réponse"}
            />
          </SelectTrigger>
          <SelectContent
            ref={(ref) => {
              if (!ref) return;
              ref.ontouchstart = (e) => e.stopPropagation();
            }}
          >
            {question.options?.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export const BodyQuestion = ({ question }: { question: Question<"body"> }) => {
  const useMSF = useMultiStepFormContext();
  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      render={(field) => {
        const content =
          question.options[field.value as keyof typeof question.options];
        return (
          <div className="flex flex-col gap-2">
            <div className="self-center">
              <Body
                value={field.value}
                content={question.options}
                onSelectionChange={(value) => {
                  field.onChange(value ?? "");
                }}
              />
            </div>
            {field.value ? (
              <div className="flex flex-col gap-2 animate-[in_0.5s_ease-in-out]">
                <div className="flex flex-row items-center flex-wrap gap-2">
                  Vous avez sélectionné:
                  <Badge variant="default" className="rounded-sm">
                    {field.value}
                  </Badge>
                </div>
                <p>Contenu:</p>
                <div className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                  <ul className="list-disc list-inside">
                    {content.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export const TerminatorButtonQuestion = ({
  question,
}: {
  question: Question<"terminatorButton">;
}) => {
  const useMSF = useMultiStepFormContext();

  return (
    <FieldWrapper
      question={question}
      form={useMSF.form}
      itemClassName="flex flex-row gap-2 justify-between items-center"
      render={() => (
        <Button
          type="button"
          className="flex flex-row w-fit gap-2 justify-start self-end min-w-0 max-w-[50%] group"
          variant={question.variant ?? "default"}
          onClick={() => {
            useMSF.submission.stopFlow.buttonCanStopFlow(question);
          }}
        >
          {question.buttonLabel ? (
            <span className="truncate min-w-0">{question.buttonLabel}</span>
          ) : null}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </Button>
      )}
    />
  );
};
