"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export const Signup = () => {
  const router = useRouter();
  const { mutate, isLoading } = api.auth.logout.useMutation({
    onSuccess: ({ redirect }) => {
      // redirect to dashboard
      console.log("success");
      router.push(redirect);
    },
    onError: (error) => {
      // show error
      console.log(error.message);
    },
  });

  return (
    <Button
      onClick={() =>
        // mutate({ email: "alex.vencel.96@gmail.com", password: "Test1234" })
        mutate()
      }
      disabled={isLoading}
    >
      Create account
    </Button>
  );
};
