"use client";

import {
  Card,
  CardDescription,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tables, Database } from "@/supabase.types";
import { useMutation } from "@tanstack/react-query";
import {
  acceptFriendRequestAction,
  addFriendAction,
  declineFriendRequestAction,
} from "@/lib/actions/friends/friendsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ViewFriendMessage from "../secret-3/ViewFriendMessage";

export type UserWithRequestStatus = Tables<"Profile"> & {
  requestStatus?:
    | Database["public"]["Enums"]["friendrequeststatusenum"]
    | undefined;
  requestId?: number | undefined;
  requestTo?: string | undefined;
  senderId?: string | undefined;
  loggedUserId: string;
};

export default function UsersList({
  usersData,
}: {
  usersData: UserWithRequestStatus[];
}) {
  const router = useRouter();

  const { mutate: addFriendMutate, isPending: addFriendPending } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return await addFriendAction(userId);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      router.refresh();
    },
  });

  const {
    mutate: acceptFriendRequestMutate,
    isPending: acceptFriendRequestPending,
  } = useMutation({
    mutationFn: async ({ requestId }: { requestId: number }) =>
      acceptFriendRequestAction(requestId),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      router.refresh();
    },
  });

  const {
    mutate: declineFriendRequestMutate,
    isPending: declineFriendRequestPending,
  } = useMutation({
    mutationFn: async ({ requestId }: { requestId: number }) =>
      declineFriendRequestAction(requestId),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      router.refresh();
    },
  });

  return (
    <>
      {usersData.length > 0 ? (
        <>
          {usersData.map((user) => (
            <Card key={user.id} className="min-w-[400px]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {user.fullname}
                </CardTitle>
                <CardDescription className="">{user.email}</CardDescription>
                <CardDescription>
                  Joined on:{""}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardAction>
                  {user.requestTo === user.loggedUserId &&
                    user.requestStatus === "PENDING" &&
                    user.requestId && (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() =>
                            acceptFriendRequestMutate({
                              requestId: user.requestId!,
                            })
                          }
                          disabled={acceptFriendRequestPending}
                        >
                          Accept Request
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            declineFriendRequestMutate({
                              requestId: user.requestId!,
                            })
                          }
                          disabled={declineFriendRequestPending}
                        >
                          Reject Request
                        </Button>
                      </div>
                    )}

                  {user.requestTo === user.loggedUserId &&
                    user.requestStatus === "ACCEPTED" && (
                      <ViewFriendMessage friendId={user.id} />
                    )}

                  {user.senderId === user.loggedUserId &&
                    user.requestStatus === "PENDING" && (
                      <Button disabled className="cursor-not-allowed">
                        Request sent
                      </Button>
                    )}

                  {user.senderId === user.loggedUserId &&
                    user.requestStatus === "ACCEPTED" && (
                      <ViewFriendMessage friendId={user.id} />
                    )}

                  {(!user.requestStatus ||
                    user.requestStatus === "DECLINED") && (
                    <Button
                      className="cursor-pointer"
                      onClick={() => addFriendMutate({ userId: user.id })}
                    >
                      Add Friend
                    </Button>
                  )}
                </CardAction>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl font-bold">No users found</p>
          </div>
        </>
      )}
    </>
  );
}
