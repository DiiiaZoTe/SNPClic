"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { errorToast } from "@/components/utilities/toasts";
import { Loader2 } from "lucide-react";

import { LoginSchema, loginSchema } from "@/lib/auth/schemas";

// @ts-ignore
import { useFormState } from "react-dom";
import { loginAction } from "@/server/auth/actions";
import { useEffect, useRef } from "react";
import { SubmitButton } from "@/components/utilities/submitButton";
import MyLink from "@/components/utilities/link";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const [state, formAction] = useFormState(loginAction, null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.fieldError) {
      if (state.fieldError.email)
        form.setError("email", {
          type: "manual",
          message: state.fieldError.email,
        });
      if (state.fieldError.password)
        form.setError("password", {
          type: "manual",
          message: state.fieldError.password,
        });
    }
    if (state?.loginError) {
      const errorMessage =
        state?.loginError ?? "Une erreur est survenue. Veuillez réessayer.";
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
      errorToast({
        title: "Erreur de connexion",
        description: errorMessage,
      });
    }
  }, [state, form]);

  const submitAction = async (data: FormData) => {
    // validate form
    const isValid = await form.trigger();
    if (!isValid) return;
    // call server action
    formAction(data);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={submitAction}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                  <Button
                    asChild
                    variant="linkForeground"
                    className="p-0 h-fit font-normal"
                  >
                    <MyLink href="/forgot-password" className="text-xs w-fit">
                      Mot de passe oublié?
                    </MyLink>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          className="mt-2"
          loader={<Loader2 className="animate-spin" />}
        >
          Se connecter
        </SubmitButton>
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
};
