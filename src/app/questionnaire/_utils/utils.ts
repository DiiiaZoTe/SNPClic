import type { StepDirection } from "../types";

/** Scroll to allow the element to be visible */
export const scrollToViewIfNeeded = (ref?: React.RefObject<HTMLElement>, smooth = true) => {
  if (!ref) return false;
  if (!ref.current) return false;
  const rect = ref.current.getBoundingClientRect();
  if (rect.top >= 0 && rect.top <= window.innerHeight) return;
  ref.current?.scrollIntoView({
    behavior: smooth ? "smooth" : "instant",
  });
};

/** Constants for the step form animation */
const X_FORM_MOVE = 200;
/** Variants for the step form animation */
export const stepFormVariants = {
  enter: (direction: StepDirection) => ({
    x: direction === "forward" ? X_FORM_MOVE : -X_FORM_MOVE,
    opacity: 0,
    transition: {
      delay: 0.2,
    },
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
  exit: (direction: StepDirection) => ({
    zIndex: 0,
    x: direction === "backward" ? X_FORM_MOVE : -X_FORM_MOVE,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};
