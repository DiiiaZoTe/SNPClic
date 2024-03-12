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

import { EmailSchema, emailSchema } from "@/lib/auth/schemas";

import { SubmitButton } from "@/components/utilities/submitButton";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { errorToast } from "@/components/utilities/toasts";

export const ForgotPasswordForm = () => {
  const { mutate, isLoading } = api.auth.forgotPassword.useMutation({
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message);
      form.reset();
    },
    onError: (error) => {
      toast.dismiss();
      errorToast({
        title: "Erreur lors de l'envoi de l'email de réinitialisation",
        description: error.message ?? "Une erreur inconnue s'est produite",
      });
    },
  });

  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ email }) => {
          mutate({ email });
        })}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="xyz@example.com"
                  autoComplete="email"
                  {...field}
                />
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
          Confirmer
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </SubmitButton>

        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
};
