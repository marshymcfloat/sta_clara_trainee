import { AuthRegisterTypes } from "@/lib/zod/authSchema";
import { authRegisterSchema } from "@/lib/zod/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import { ArrowLeftIcon, LoaderCircle, UserPlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authRegisterAction } from "@/lib/actions/auth/authAction";
import { toast } from "sonner";
export default function AuthRegisterForm({
  setContent,
}: {
  setContent: (content: "LOGIN" | "REGISTER") => void;
}) {
  const form = useForm<AuthRegisterTypes>({
    resolver: zodResolver(authRegisterSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formInputs = Object.keys(
    form.getValues()
  ) as (keyof AuthRegisterTypes)[];

  const {
    mutate: register,
    isPending,
    error,
  } = useMutation({
    mutationFn: authRegisterAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success("Please check your email for verification");
      setContent("LOGIN");
    },
    onError: (error) => {
      toast.error(
        error.message || "There was an error registering your account"
      );
    },
  });

  function handleSubmission(types: AuthRegisterTypes) {
    register(types);
  }

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(handleSubmission)}
        className="space-y-4"
      >
        {formInputs.map((input) => (
          <FormField
            key={input}
            control={form.control}
            name={input}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize font-medium">
                  {input}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={
                      input === "password" || input === "confirmPassword"
                        ? "password"
                        : input === "fullname"
                        ? "text"
                        : "email"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end">
          <div className="space-x-4 flex items-center">
            <Button
              type="button"
              disabled={isPending}
              className=""
              variant={"secondary"}
              onClick={() => setContent("LOGIN")}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlusIcon className="w-4 h-4 mr-2" />
              )}
              Register
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
