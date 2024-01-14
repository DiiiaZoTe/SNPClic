"use client";

import React, {
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
  useEffect,
} from "react";
import { X, ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command as CommandPrimitive } from "cmdk";
import { set } from "zod";
import Balancer from "react-wrap-balancer";

export type ValueLabelType = Record<"value" | "label", string>;

export function FancyMultiSelect({
  options,
  placeholder,
  allSelectedPlaceholder,
  onSelectionChange,
  value,
}: {
  options: ValueLabelType[];
  placeholder: string;
  allSelectedPlaceholder?: string;
  onSelectionChange?: (selected: ValueLabelType[]) => void;
  value?: ValueLabelType[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ValueLabelType[]>(value ?? []);
  const [inputValue, setInputValue] = useState("");
  const isMounted = useRef(false);

  const handleUnselect = useCallback((framework: ValueLabelType) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  useEffect(() => {
    if (isMounted.current && onSelectionChange) {
      onSelectionChange(selected);
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter((option) => !selected.includes(option));

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setInputValue("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          aria-controls="select-menu"
          className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:cursor-pointer"
        >
          {selected.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {selected.map((option, index) => (
                <div
                  tabIndex={0}
                  role="button"
                  key={index}
                  className="ring-offset-background rounded-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(option);
                  }}
                >
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="rounded-sm flex items-center gap-1 group justify-between text-left"
                  >
                    <span>
                      <Balancer>{option.label}</Balancer>
                    </span>
                    <X className="min-w-[0.5rem] min-h-[0.5rem] w-2 h-2 text-muted-foreground group:hover:text-foreground" />
                  </Badge>
                </div>
              ))}
            </div>
          ) : open && selected.length === 0 ? (
            <span>...</span>
          ) : selected.length === options.length ? (
            <span>{allSelectedPlaceholder ?? placeholder}</span>
          ) : (
            <span>{placeholder ?? "Sélectionner..."}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        // Size is set based on the width of the trigger.
        // Responsive design calculated based on all the paddings and margins, minus 2px for the border
        className="w-[476px] max-w-[calc(100svw-8rem-2px)] mx-16 p-0"
      >
        <Command className="p-1 gap-1" onKeyDown={handleKeyDown}>
          <div className="flex flex-row items-center gap-2 text-sm p-2 bg-background border border-input rounded-sm min-w-0">
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              placeholder={
                selected.length === options.length
                  ? allSelectedPlaceholder ?? placeholder
                  : placeholder ?? "Sélectionner..."
              }
              className="outline-none bg-transparent text-foregound w-full placeholder:text-muted-foreground"
            />
            <Search className="h-4 w-4 opacity-50" />
          </div>
          <CommandGroup className="p-0 max-h-80 overflow-scroll">
            {selectables.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  setInputValue("");
                  setSelected((prev) => [...prev, option]);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
