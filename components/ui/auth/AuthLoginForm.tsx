import { authLoginSchema, AuthLoginTypes } from "@/lib/zod/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import { Separator } from "../separator";
import { authLoginAction } from "@/lib/actions/auth/authAction";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, LogInIcon } from "lucide-react";
export default function AuthLoginForm({
  setContent,
}: {
  setContent: (content: "LOGIN" | "REGISTER") => void;
}) {
  const router = useRouter();

  const form = useForm<AuthLoginTypes>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formInputs = Object.keys(form.getValues()) as (keyof AuthLoginTypes)[];

  const { mutate: login, isPending } = useMutation({
    mutationFn: authLoginAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message || "Logged in successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "There was an error logging in");
    },
  });

  function handleSubmission(types: AuthLoginTypes) {
    login(types);
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
                    type={input === "password" ? "password" : "email"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex flex-col gap-2">
          <Button disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogInIcon />
            )}
            Login
          </Button>
          <div className="flex gap-2 items-center">
            <Separator className="flex-1" />

            <span className=" font-bold">OR</span>
            <Separator className="flex-1" />
          </div>
          <Button
            onClick={() => setContent("REGISTER")}
            type="button"
            variant={"ghost"}
            className="hover:underline"
          >
            Get started
          </Button>
        </div>
      </form>
    </Form>
  );
}
