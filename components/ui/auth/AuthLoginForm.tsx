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

export default function AuthLoginForm({
  setContent,
}: {
  setContent: (content: "LOGIN" | "REGISTER") => void;
}) {
  const form = useForm<AuthLoginTypes>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formInputs = Object.keys(form.getValues()) as (keyof AuthLoginTypes)[];

  return (
    <Form {...form}>
      <form action="" className="space-y-4">
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex flex-col gap-2">
          <Button>Login</Button>
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
