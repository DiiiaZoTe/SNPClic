"use client";

import { errorToast } from "@/components/utilities/toasts";
import { logoutAction } from "@/server/auth/actions";
import { useEffect } from "react";
// @ts-ignore
import { useFormState } from "react-dom";

interface LogoutProps extends React.HTMLProps<HTMLFormElement> {}
export default function Logout({ children, ...props }: LogoutProps) {
  const [state, formAction] = useFormState(logoutAction, null);

  useEffect(() => {
    if (state?.logoutError) {
      errorToast({
        title: "Erreur de déconnexion",
        description:
          state.logoutError ??
          "Une erreur est survenue lors de la déconnexion.",
      });
    }
  }, [state]);

  return (
    <form action={formAction} {...props}>
      {children}
    </form>
  );
}
