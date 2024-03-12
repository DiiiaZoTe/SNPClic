"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Utilisateur", value: "user" },
] as const;

const FormSchema = z.object({
  role: z.string().optional(),
  email: z.string().optional(),
});

export function FormFilter({ email, role }: { email?: string; role?: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: role ?? "",
      email: email ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const queryParam = new URLSearchParams(data);
    if (data.role === "") queryParam.delete("role");
    if (data.email === "") queryParam.delete("email");
    if (queryParam.toString() === "") router.push("");
    const query = `?${queryParam.toString()}`;
    router.push(query);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col sm:flex-row gap-4 sm:items-end"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col min-w-52">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="xyz@example.com"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 sm:w-[160px] w-full">
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full sm:w-[160px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? roles.find((role) => role.value === field.value)
                            ?.label
                        : "Tous les rôles"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[160px] p-0">
                    <Command>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            value={role.label}
                            key={role.value}
                            onSelect={() => {
                              if (form.getValues("role") === role.value)
                                form.setValue("role", "");
                              else form.setValue("role", role.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                role.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Filtrer</Button>
      </form>
    </Form>
  );
}

export function Filter({ email, role }: { email?: string; role?: string }) {
  const isDesktop = useMediaQuery("(min-width: 639px)");

  if (isDesktop) {
    return <FormFilter email={email} role={role} />;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filtrer</Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-6 p-6 sm:p-8 w-full pt-12 overflow-y-scroll max-h-[100dvh]"
        side="bottom"
      >
        <FormFilter email={email} role={role} />
      </SheetContent>
    </Sheet>
  );
}
