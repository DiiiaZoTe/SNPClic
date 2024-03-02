"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { errorToast } from "@/components/utilities/toasts";

interface LogoutProps extends React.HTMLProps<HTMLFormElement> {}
export default function Logout({ children, ...props }: LogoutProps) {
  const router = useRouter();

  const { mutate, isLoading } = api.auth.logout.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      errorToast({
        title: "Erreur de déconnexion",
        description: error.message ?? "Une erreur est survenue lors de la déconnexion."
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
