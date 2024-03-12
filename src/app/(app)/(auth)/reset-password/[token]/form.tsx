"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader2 } from "lucide-react";

import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/auth/schemas";

import { SubmitButton } from "@/components/utilities/submitButton";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { errorToast } from "@/components/utilities/toasts";
import { useRouter } from "next/navigation";

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const { mutate, isLoading } = api.auth.resetPassword.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push("/login");
    },
    onError: (error) => {
      toast.dismiss();
      errorToast({
        title: "Erreur de réinitialisation de mot de passe",
        description: error.message ?? "Une erreur inconnue s'est produite",
      });
    },
  });

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ newPassword }) => {
          mutate({
            newPassword,
            token: token,
          });
        })}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormDescription>
                Votre mot de passe doit contenir au moins 8 caractères.
              </FormDescription>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          className="group flex gap-2 items-center min-w-32"
          loading={isLoading}
          loader={<Loader2 className="animate-spin" />}
        >
          Réinitialiser
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </SubmitButton>

        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
};
