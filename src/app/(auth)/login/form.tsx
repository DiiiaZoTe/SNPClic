"use client";

import { useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorToast } from "@/components/utilities/toasts";
import { Loader2 } from "lucide-react";

import { LoginSchema, loginSchema } from "@/lib/auth/schemas";
import { api } from "@/trpc/react";

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading, isSuccess } = api.auth.login.useMutation({
    onSuccess: ({ redirect }) => {
      // redirect to dashboard
      console.log("success");
      router.replace(redirect);
    },
    onError: (error) => {
      console.log(error.message);
      form.setError("root", {
        type: "ma",
        message:
          error.message ?? "Une erreur est survenue. Veuillez réessayer.",
      });
      errorToast({
        title: "Erreur",
        description:
          error.message ?? "Une erreur est survenue. Veuillez réessayer.",
      });
    },
  });
  const pending = isLoading || isSuccess;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((fields) => mutate(fields))}
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
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? <Loader2 className=" animate-spin" /> : "Se connecter"}
        </Button>
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
};
