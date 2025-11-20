"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { updateSecretMessageAction } from "@/lib/actions/secret/secretActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateRandomSecretMessage } from "@/lib/utils";

export default function EditSecretMessage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const { mutate: updateMessage, isPending } = useMutation({
    mutationFn: async (message: string) => updateSecretMessageAction(message),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      setMessage("");
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    updateMessage(message);
  };

  const handleGenerateRandom = () => {
    const randomMessage = generateRandomSecretMessage();
    setMessage(randomMessage);
  };

  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle>Edit Secret Message</CardTitle>
        <CardDescription>Add or update your secret message</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Secret Message</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateRandom}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                Generate Random
              </Button>
            </div>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Saving..." : "Save Message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
