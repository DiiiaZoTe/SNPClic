"use client";

import { useEffect, useMemo, useState } from "react";
import useBreakpoint from "use-breakpoint";
import { cn } from "../utils";

type BreakpointsType = {
  [key: string]: number;
};

export const BreakpointVisualizer = ({
  breakpoints,
}: {
  breakpoints: BreakpointsType;
}) => {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<number | null>(
    null
  );

  const sortedBreakpoints = useMemo(() => {
    return Object.entries(breakpoints)
      .map((entry, index, array) => {
        const [name, min] = entry;
        const max =
          index === array.length - 1 ? undefined : array[index + 1][1];
        return { name, min, max };
      })
      .reverse();
  }, [breakpoints]);

  const { breakpoint, minWidth, maxWidth } = useBreakpoint(breakpoints, "2xl");

  useEffect(() => {
    setSelectedBreakpoint(minWidth);
  }, [breakpoint]);

  const handleSegmentClick = (value: number) => {
    setSelectedBreakpoint(value);
  };

  return (
    <div className="sticky top-0 w-full z-50 h-10 flex justify-center items-center overflow-hidden bg-white/60 dark:bg-black/80 backdrop-blur">
      {sortedBreakpoints.map(({ name, min, max }, index) => (
        <div
          className={cn(
            " pl-2 flex items-center absolute top-0 h-full left-1/2 -translate-x-1/2 border border-t-0",
            index === 0 ? "border-l-0 border-r-0" : null
          )}
          style={{ width: max ? `${max}px` : "100%", minWidth: `${min}px` }}
        >
          <p className="text-sm text-black/50 dark:text-white/50">{name}</p>
        </div>
      ))}
      <p className="z-50">{breakpoint}</p>
    </div>
  );
};
