import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import UsersList, { UserWithRequestStatus } from "./UsersList";

export default async function UsersDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div>Error: {userError?.message}</div>;
  }

  const { data: usersData, error } = await supabase
    .from("Profile")
    .select("*, Friend_request(*)")
    .neq("id", user?.id);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { data: friendRequestsData, error: friendRequestsError } =
    await supabase
      .from("Friend_request")
      .select("*")
      .or(`sender_id.eq.${user.id},request_to.eq.${user.id}`);

  const usersWithFrienRequestStatus: UserWithRequestStatus[] = usersData.map(
    (profileUser) => {
      const request = friendRequestsData?.find(
        (request) =>
          request.sender_id === profileUser.id ||
          request.request_to === profileUser.id
      );
      return {
        ...profileUser,
        requestStatus: request?.status,
        requestId: request?.id,
        requestTo: request?.request_to,
        senderId: request?.sender_id,
        loggedUserId: user.id,
      };
    }
  );

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <UsersList usersData={usersWithFrienRequestStatus} />
    </div>
  );
}
