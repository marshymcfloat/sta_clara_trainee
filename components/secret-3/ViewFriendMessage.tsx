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
import { useMutation } from "@tanstack/react-query";
import { getFriendSecretMessageAction } from "@/lib/actions/secret/secretActions";
import { toast } from "sonner";

export default function ViewFriendMessage({ friendId }: { friendId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: fetchMessage, isPending } = useMutation({
    mutationFn: async (friendId: string) =>
      getFriendSecretMessageAction(friendId),
    onSuccess: (data) => {
      if (!data.success) {
        if (data.status === 401) {
          toast.error("Unauthorized: You are not friends with this user");
        } else {
          toast.error(data.error);
        }
        setIsOpen(false);
        return;
      }
      setMessage(data.data?.message || "No secret message yet");
      setIsOpen(true);
    },
  });

  const handleView = () => {
    fetchMessage(friendId);
  };

  if (!isOpen) {
    return (
      <Button onClick={handleView} disabled={isPending}>
        {isPending ? "Loading..." : "View Secret Message"}
      </Button>
    );
  }

  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <CardTitle>Friend's Secret Message</CardTitle>
        <CardDescription>Their secret message:</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-4">
          {message || "No secret message yet"}
        </p>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </CardContent>
    </Card>
  );
}

