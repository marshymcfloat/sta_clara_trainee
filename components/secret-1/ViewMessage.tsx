import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EditIcon } from "lucide-react";

export default async function ViewMessage() {
  const supabase = await createClient(cookies());

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return <div>Error: {userError?.message}</div>;
  }

  const { data: secretMessageData, error: secretMessageError } = await supabase
    .from("Secret_message")
    .select("message")
    .eq("author_id", userData.user.id)
    .maybeSingle();

  if (secretMessageError) {
    return <div>Error: {secretMessageError?.message}</div>;
  }

  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardDescription>Your secret message is:</CardDescription>
        <CardTitle>
          {secretMessageData?.message || "No secret message yet"}
        </CardTitle>
        <CardAction>
          <Link href={"/secret-2"}>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="hover:bg-slate-100/50! hover:text-primary!"
            >
              <EditIcon />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
