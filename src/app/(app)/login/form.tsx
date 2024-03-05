// "use client";

// import { useRouter } from "next/navigation";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { errorToast } from "@/components/utilities/toasts";
// import { Loader2 } from "lucide-react";

// import { LoginSchema, loginSchema } from "@/lib/auth/schemas";
// import { useMutation } from "@tanstack/react-query";

// const loginUser = async (input: LoginSchema) => {
//   const response = await fetch("/api/auth/login", {
//     method: "POST",
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(input),
//   });
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message);
//   }
//   return data;
// };

// export const LoginForm = () => {
//   const router = useRouter();

//   const form = useForm<LoginSchema>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const { mutate, isLoading, isSuccess } = useMutation(loginUser, {
//     onSuccess: (data) => {
//       console.log(data);
//     },
//     onError: (error: { message: string }) => {
//       const errorMessage =
//         error.message ?? "Une erreur est survenue. Veuillez réessayer.";

//       form.setError("root", {
//         type: "manual",
//         message: errorMessage,
//       });
//       errorToast({
//         title: "Erreur de déconnexion",
//         description: errorMessage,
//       });
//     },
//   });
//   const pending = isLoading || isSuccess;

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit((fields) => mutate(fields))}
//         className="w-full flex flex-col gap-4"
//       >
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   type="email"
//                   placeholder="xyz@example.com"
//                   autoComplete="email"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Mot de passe</FormLabel>
//               <FormControl>
//                 <Input
//                   type="password"
//                   placeholder="••••••••"
//                   autoComplete="current-password"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" disabled={pending} className="mt-2">
//           {pending ? <Loader2 className=" animate-spin" /> : "Se connecter"}
//         </Button>
//         <FormMessage>{form.formState.errors.root?.message}</FormMessage>
//       </form>
//     </Form>
//   );
// };

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
        title: "Erreur de déconnexion",
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
        // onSubmit={form.handleSubmit( () => formRef.current?.submit())}
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

// const errorMessage =
//   error.message ?? "Une erreur est survenue. Veuillez réessayer.";

// form.setError("root", {
//   type: "manual",
//   message: errorMessage,
// });
// errorToast({
//   title: "Erreur de déconnexion",
//   description: errorMessage,
// });
