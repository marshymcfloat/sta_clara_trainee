import ViewMessage from "@/components/secret-1/ViewMessage";
import EditSecretMessage from "@/components/secret-2/EditSecretMessage";
import UsersDataContainer from "@/components/secret-1/UsersDataContainer";
import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SecretPage3() {
  const supabase = await createClient(cookies());

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/");
  }

  return (
    <main className="py-18 px-4 flex flex-col gap-8 items-center min-h-screen pt-24">
      <div className="flex flex-col gap-8 items-center w-full max-w-6xl">
        <div className="flex gap-8 w-full">
          <div className="flex-1 flex justify-center">
            <ViewMessage />
          </div>
          <div className="flex-1 flex justify-center">
            <EditSecretMessage />
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
          <UsersDataContainer />
        </div>
      </div>
    </main>
  );
}

