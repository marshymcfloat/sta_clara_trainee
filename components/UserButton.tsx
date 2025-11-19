"use client";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderCircle, LogOut, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authLogoutAction } from "@/lib/actions/auth/authAction";
import { toast } from "sonner";
import { createClient } from "@/lib/utils/supabase/client";
import { useEffect, useState } from "react";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const [user, setUser] = useState<string | null>(null);
  const [userError, setUserError] = useState<AuthError | PostgrestError | null>(
    null
  );
  const [userLoading, setUserLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setUserLoading(true);
      const supabase = createClient();

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        setUserError(userError);
        setUserLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("Profile")
        .select("fullname")
        .eq("id", userData.user?.id)
        .single();

      if (profileError) {
        setUserError(profileError);
        setUserLoading(false);
        return;
      }

      setUser(profileData.fullname);
      setUserLoading(false);
    }

    fetchUser();
  }, []);

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
      toast.success(data.message || "Logged out successfully");
      router.push("/");
    },
  });

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {userLoading ? (
              <Skeleton className="size-10 rounded-full" />
            ) : (
              <Avatar className="cursor-pointer p-4 bg-primary text-primary-foreground font-bold">
                <AvatarFallback>{avatarInitials}</AvatarFallback>
              </Avatar>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-destructive hover:text-destructive!">
              <Trash color="red" />
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
      ) : null}
    </>
  );
}
