"use client";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderCircle, LogOut, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authDeleteAccountAction,
  authLogoutAction,
} from "@/lib/actions/auth/authAction";
import { toast } from "sonner";
import { createClient } from "@/lib/utils/supabase/client";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

async function fetchUserProfile() {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return null;

  const { data: profileData, error: profileError } = await supabase
    .from("Profile")
    .select("fullname")
    .eq("id", userData.user.id)
    .single();

  if (profileError) return null;

  return profileData.fullname as string;
}

export default function UserButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
    retry: false,
  });

  const avatarInitials =
    user &&
    user
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word: string) => word[0].toUpperCase())
      .join("");

  const { isPending, mutate: logout } = useMutation({
    mutationFn: authLogoutAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "There was an error logging out");
        return;
      }

      queryClient.setQueryData(["user-profile"], null);

      toast.success(data.message || "Logged out successfully");
      router.refresh();
      router.push("/");
    },
  });

  const { mutate: deleteAccount } = useMutation({
    mutationFn: authDeleteAccountAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "There was an error deleting your account");
        return;
      }
      toast.success(data.message || "Account deleted successfully");
      logout();
    },
    onError: (error) => {
      toast.error(error.message || "There was an error deleting your account");
    },
  });

  if (userLoading) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer p-4 bg-primary text-primary-foreground font-bold">
          <AvatarFallback>{avatarInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive hover:text-destructive!"
          onClick={() => deleteAccount()}
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Trash color="red" />
          )}
          Delete Account
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isPending} onClick={() => logout()}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LogOut />
          )}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
