import ViewMessage from "@/components/secret-1/ViewMessage";
import EditSecretMessage from "@/components/secret-2/EditSecretMessage";
import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SecretPage2() {
  const supabase = await createClient(cookies());

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/");
  }

  return (
    <main className="py-18 px-4 flex justify-center items-center h-screen">
      <div className="flex flex-col gap-8 items-center">
        <ViewMessage />
        <EditSecretMessage />
      </div>
    </main>
  );
}
