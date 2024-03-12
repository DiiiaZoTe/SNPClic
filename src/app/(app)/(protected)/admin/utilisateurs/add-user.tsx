"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { EmailSchema, emailSchema } from "@/lib/auth/schemas";
import { SubmitButton } from "@/components/utilities/submitButton";
import { api } from "@/trpc/react";
import { errorToast } from "@/components/utilities/toasts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AddUser = () => {
  const router = useRouter();
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isLoading } = api.auth.createNewUserAccount.useMutation({
    onSuccess: ({ email }) => {
      form.reset();
      toast.success(`L'utilisateur ${email} a été ajouté avec succès.`);
      router.refresh();
    },
    onError: (error) => {
      form.reset();
      errorToast({
        title: "Erreur lors de l'ajout de l'utilisateur.",
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="black">
          Ajouter
          <Plus className="ml-2 w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter un nouvel utilisateur</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez entrer l&apos;adresse email de l&apos;utilisateur que vous
            souhaitez ajouter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ email }) => {
              mutate({ email });
            })}
            className="flex flex-col gap-4"
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
            <div className="flex gap-4 flex-col xs:flex-row xs:self-end ">
              <AlertDialogCancel type="button" className="min-w-32 m-0">
                Annuler
              </AlertDialogCancel>

              <SubmitButton
                variant="black"
                className="min-w-32"
                loader={<Loader2 className="animate-spin" />}
                loading={isLoading}
              >
                Ajouter
              </SubmitButton>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
