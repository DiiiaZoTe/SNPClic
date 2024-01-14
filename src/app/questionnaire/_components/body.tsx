"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PATHS: Path = {
  Torso:
    "m130.75,275.69s-13.17,6.51-27.56,10.26c-.75-11.71-10.49-20.99-22.4-20.99s-21.65,9.28-22.4,20.99c-14.39-3.75-27.56-10.26-27.56-10.26-.51-11.57,2.01-22.46,4.86-33.69,1.97-7.77,1.58-16.09,3.8-23.73,2.9-9.98,3.15-18.18-1.15-28.49-1.43-3.44-2.02-16.1-2.38-24.29-2.26-28.97-5.39-42.3-.14-69.27,39.86,7.63,48.86,7.63,89.94,0,5.25,26.97,2.12,40.3-.14,69.27-.36,8.19-.95,20.85-2.38,24.29-4.3,10.31-4.05,18.51-1.15,28.49,2.22,7.64,1.83,15.96,3.8,23.73,2.85,11.23,5.37,22.12,4.86,33.69Z",
  "Arm Left":
    "m27.02,206.27c-.71,2.66-.27,10.04-.38,15.06-.1,4.76.17,9.5-.49,14.22-.79,5.58-2.69,10.92-4.17,16.36-.63,7.05-1.63,14.1-1.72,21.16-.05,3.34.73,7.45,2.74,9.89,2.75,3.34,4.23,5,4.01,10.7-.14,1.14,1.81,10.39,2.9,16.22.27,1.46-1.35,2.58-2.58,1.75-4.36-2.97-3.65-8.78-6.79-12.43-.34-.4-.88-.22-1.2.19-.77.98-3.66,5.94-1.74,12.17.63,2.03,2.81,3.98,4.18,4.78,1.06.62,3.18.76,4.77,1.14,2.02.89,2.13,3,.48,3.93-3.97,2.25-10.58-.94-14.17-3.85-2.64-2.14-3.94-4.4-5.38-7.35-.85-1.74-1.27-3.09-1.3-4.97-.07-3.53-.01-6.22-.02-7.12,0,0,.06-10.67-.25-15.71-.56-9.04-2.38-23.96-4.02-36.01-1-7.31-3.12-19.49-.94-29.49.14-1.78.29-3.55.43-5.33.97-7.99,2.06-15.97,2.86-23.97.73-7.22.12-14.63,1.72-21.7.69-3.06,2.2-7.15,2.9-10.21.71-3.07,1.59-8.07.82-11.51-2.44-10.78-2.85-29.77,8-42.69,3.59-4.28,7.7-5.5,12.89-4.82,1.07.14,4.29-.04,5.25-.46-5.25,26.97-2.12,40.3.14,69.27-.19,0-1.23,17.32-3.54,26.07-1.29,4.87-4.48,11.28-5.4,14.71Z",
  "Arm Right":
    "m159.69,246.4c-1.64,12.05-3.46,26.97-4.02,36.01-.31,5.04-.25,15.71-.25,15.71,0,.9.05,3.59-.02,7.12-.03,1.88-.45,3.23-1.3,4.97-1.44,2.95-2.74,5.21-5.38,7.35-3.59,2.91-10.2,6.1-14.17,3.85-1.65-.93-1.54-3.04.48-3.93,1.59-.38,3.71-.52,4.77-1.14,1.37-.8,3.55-2.75,4.18-4.78,1.92-6.23-.97-11.19-1.74-12.17-.32-.41-.86-.59-1.2-.19-3.14,3.65-2.43,9.46-6.79,12.43-1.23.83-2.85-.29-2.58-1.75,1.09-5.83,3.04-15.08,2.9-16.22-.22-5.7,1.26-7.36,4.01-10.7,2.01-2.44,2.79-6.55,2.74-9.89-.09-7.06-1.09-14.11-1.72-21.16-1.48-5.44-3.38-10.78-4.17-16.36-.66-4.72-.39-9.46-.49-14.22-.11-5.02.33-12.4-.38-15.06-.92-3.43-4.11-9.84-5.4-14.71-2.31-8.75-3.35-26.07-3.54-26.07,2.26-28.97,5.39-42.3.14-69.27.96.42,4.18.6,5.25.46,5.19-.68,9.3.54,12.89,4.82,10.85,12.92,10.44,31.91,8,42.69-.77,3.44.11,8.44.82,11.51.7,3.06,2.21,7.15,2.9,10.21,1.6,7.07.99,14.48,1.72,21.7.8,8,1.89,15.98,2.86,23.97.14,1.78.29,3.55.43,5.33,2.18,10,.06,22.18-.94,29.49Z",
  Head: "m125.76,96.22c-41.08,7.63-50.08,7.63-89.94,0,12.64-5.46,28.78-21.81,28.78-24.81,0-1.89-4.42-10.22-5.81-11.73-.93-1.01-3.69-1.25-4.56-2.16-2.05-2.17-3.63-8.13-4.66-12.68-.73-3.21-.05-6.17,4.23-6.43,4.17-1.04,2.38-4.95,2.19-6.57-1.44-8.62-.11-16.77,5.11-23.86C65.96,1.38,72.54.19,80.79,0c8.25.19,14.83,1.38,19.69,7.98,5.22,7.09,6.55,15.24,5.11,23.86-.19,1.62-1.98,5.53,2.19,6.57,4.28.26,4.96,3.22,4.23,6.43-1.03,4.55-2.61,10.51-4.66,12.68-.87.91-3.63,1.15-4.56,2.16-1.39,1.51-5.81,9.84-5.81,11.73,0,3,16.14,19.35,28.78,24.81Z",
  Crotch:
    "m103.24,287.41c0,12.01-9.43,21.83-21.29,22.43,0-2.55,0-5.08-.01-7.59h0c-.01-2.24-.02-4.44-.04-6.62-.01-1.3.52-3.46.73-4.28.05-.18-.08-.34-.26-.35-.35,0-.92-.01-1.58-.03-.66.02-1.23.03-1.58.03-.18.01-.31.17-.26.35.21.82.74,2.98.73,4.28-.02,2.18-.03,4.38-.04,6.61h0c-.01,2.52-.01,5.05-.02,7.6-11.85-.61-21.28-10.42-21.28-22.43,0-.49.02-.98.05-1.46.75-11.71,10.49-20.99,22.4-20.99s21.65,9.28,22.4,20.99c.03.48.05.97.05,1.46Z",
  "Leg Left":
    "m78.23,418.07c-2.08,4.28-2.28,8.44-.55,12.45,1.05,2.46,1.37,5.32,1.33,8-.25,15.12-2.94,34.32-3.67,41.44-.96,5.98-4.89,26.89-2.27,38.5,1.55,6.93,3.4,10.03,4.5,16.76.34,2.1-1.53,3.76-3.62,4.19-3.99.83-15.99.4-18.6-1.34-1.73-1.15-1.4-4.31.16-7.3,3.58-6.85,4.17-5.89,4.83-15.47.38-5.48-1.98-11.81-3.56-17.33-3.64-12.68-7.13-42.58-7.63-45.97-1.25-8.46-3.41-18.67-.59-26.52,1.74-4.86,3.99-17.12,2.61-26.33-.67-4.5-1.02-9.17-2.56-13.39-4.24-11.65-10.26-22.68-13.61-34.62-2.71-9.67-5.15-22.02-4.98-29.49.07-3.36,1.12-6.63,1.56-9.96.17-1.28.06-2.61-.03-3.9-.36-5.57-.95-11.13-1.08-16.7-.11-5.13.58-10.28.36-15.4,0,0,13.17,6.51,27.56,10.26-.03.48-.05.97-.05,1.46,0,12.01,9.43,21.82,21.28,22.43-.02,8.33-.05,16.77-.28,24.79-.14,5.08-1.26,9.22-1.06,12.44.28,4.42.88,9.16.95,13.56.27,16.93.64,30.85.56,47.78,0,2.25-1.07,7.41-1.56,9.66Z",
  "Leg Right":
    "m110.41,399.15c-1.38,9.21.87,21.47,2.61,26.33,2.82,7.85.66,18.06-.59,26.52-.5,3.39-3.99,33.29-7.63,45.97-1.58,5.52-3.94,11.85-3.56,17.33.66,9.58,1.25,8.62,4.83,15.47,1.56,2.99,1.89,6.15.16,7.3-2.61,1.74-14.61,2.17-18.6,1.34-2.09-.43-3.96-2.09-3.62-4.19,1.1-6.73,2.95-9.83,4.5-16.76,2.62-11.61-1.31-32.52-2.27-38.5-.73-7.12-3.42-26.32-3.67-41.44-.04-2.68.28-5.54,1.33-8,1.73-4.01,1.53-8.17-.55-12.45-.49-2.25-1.55-7.41-1.56-9.66-.08-16.93.29-30.85.56-47.78.07-4.4.67-9.14.95-13.56.2-3.22-.92-7.36-1.06-12.44-.23-8.02-.26-16.46-.29-24.79,11.86-.6,21.29-10.42,21.29-22.43,0-.49-.02-.98-.05-1.46,14.39-3.75,27.56-10.26,27.56-10.26-.22,5.12.47,10.27.36,15.4-.13,5.57-.72,11.13-1.08,16.7-.09,1.29-.2,2.62-.03,3.9.44,3.33,1.49,6.6,1.56,9.96.17,7.47-2.27,19.82-4.98,29.49-3.35,11.94-9.37,22.97-13.61,34.62-1.54,4.22-1.89,8.89-2.56,13.39Z",
};

const DEBOUNCE_HOVER = 250; //ms

export type PathId =
  | "Torso"
  | "Arm Left"
  | "Arm Right"
  | "Head"
  | "Crotch"
  | "Leg Left"
  | "Leg Right";

export type PathContent = Record<PathId, string>;
export type Path = Record<PathId, string>;
type OnSelectionChange = (selected?: PathId) => void;

export const Body = ({
  value,
  content,
  onSelectionChange,
}: {
  value?: PathId;
  content: PathContent;
  onSelectionChange: OnSelectionChange;
}) => {
  
  const {
    selectedPath,
    selectPath,
    hoveredPath,
    onMouseEnter,
    onMouseLeave,
    isHovered,
    popoverContent,
  } = useSelectedPath({ value, content, onSelectionChange });

  return (
    <div className="p-2 w-40 flex flex-col">
      <Button
        className="w-8 h-8 self-end p-1"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          selectPath(undefined);
        }}
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Popover open={isHovered}>
        <PopoverTrigger asChild>
          <svg id="Layer_2" viewBox="-1 -1 163 541">
            <defs>
              <pattern
                id="dottedPattern"
                patternUnits="userSpaceOnUse"
                width="5"
                height="5"
              >
                <circle cx="4" cy="4" r="1" className="fill-primary/70" />
              </pattern>
            </defs>
            <g>
              <AnimatePresence>
                {Object.keys(PATHS).map((key) => {
                  const id = key as PathId;
                  const path = PATHS[id];
                  return (
                    <path
                      onMouseEnter={() => onMouseEnter(id)}
                      key={id}
                      className="fill-muted stroke-foreground/20 stroke-1"
                      d={path}
                    />
                  );
                })}

                {hoveredPath && (
                  // hovered case: path not selected but hovered
                  <motion.path
                    key={`hovered_${hoveredPath}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    onClick={() => selectPath(hoveredPath)}
                    onMouseLeave={() => onMouseLeave()}
                    className="fill-foreground/30 stroke-foreground/40 stroke-1 cursor-pointer"
                    d={PATHS[hoveredPath]}
                  />
                )}
                {selectedPath && (
                  // selected case: path selected
                  <motion.path
                    key={`selected_${selectedPath}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    onClick={() => selectPath(hoveredPath)}
                    className="fill-primary/50 stroke-primary stroke-2 cursor-pointer"
                    d={PATHS[selectedPath]}
                  />
                )}
              </AnimatePresence>
            </g>
          </svg>
        </PopoverTrigger>
        <PopoverContent sideOffset={16} side="top" avoidCollisions={false}>
          <p className="text-xs">{popoverContent}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const useSelectedPath = ({
  value,
  content,
  onSelectionChange,
}: {
  value?: PathId;
  content: PathContent;
  onSelectionChange: OnSelectionChange;
}) => {
  const [selectedPath, setSelectedPath] = useState<PathId | undefined>(value);
  const [hoveredPath, setHoveredPath] = useState<PathId | undefined>();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout>();
  const [popoverContent, setPopoverContent] = useState<string>();

  const selectPath = (path?: PathId) => {
    if (path === selectedPath) {
      setSelectedPath(undefined);
      onSelectionChange(undefined);
      return;
    }
    setSelectedPath(path);
    onSelectionChange(path);
  };

  const onMouseEnter = (path: PathId) => {
    if (path !== selectedPath) {
      setHoveredPath(path);
    }
  };

  const onMouseLeave = () => {
    setHoveredPath(undefined);
  };

  useEffect(() => {
    if (hoveredPath) {
      hoverTimeout.current = setTimeout(() => {
        setIsHovered(true);
        setPopoverContent(content[hoveredPath]); // Update content when hovered
      }, DEBOUNCE_HOVER);
    } else {
      if (isHovered) {
        hoverTimeout.current = setTimeout(() => {
          setIsHovered(false);
          setPopoverContent(undefined); // Clear content when not hovered
        }, DEBOUNCE_HOVER);
      }
    }

    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, [content, hoveredPath, isHovered]);

  return {
    selectedPath,
    selectPath,
    hoveredPath,
    onMouseEnter,
    onMouseLeave,
    isHovered,
    popoverContent,
  };
};
