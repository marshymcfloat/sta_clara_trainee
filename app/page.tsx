import AuthDialog from "@/components/ui/auth/AuthDialog";
import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = await createClient(cookies());

  const { data: userData, error: userError } = await supabase.auth.getSession();

  return (
    <>
      <AuthDialog open={!userData.session} />
    </>
  );
}
