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
import { errorToast } from "@/components/utilities/toasts";
import { ChevronRight, Loader2 } from "lucide-react";

import { ChangePasswordSchema, changePasswordSchema } from "@/lib/auth/schemas";

import { SubmitButton } from "@/components/utilities/submitButton";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const { mutate, isLoading } = api.auth.changePassword.useMutation({
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message);
      form.reset();
    },
    onError: (error) => {
      toast.dismiss();
      errorToast({
        title: "Erreur lors du changement de mot de passe",
        description:
          error.message ?? "Une erreur est survenue. Veuillez réessayer.",
      });
    },
  });

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ currentPassword, newPassword }) => {
          mutate({ currentPassword, newPassword });
        })}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          className="group flex gap-2 items-center"
          variant="black"
          loading={isLoading}
          loader={<Loader2 className="animate-spin" />}
        >
          Confirmer
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </SubmitButton>

        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
};
