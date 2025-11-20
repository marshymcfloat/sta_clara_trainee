import AuthDialog from "@/components/ui/auth/AuthDialog";
import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient(cookies());

  const { data: userData, error: userError } = await supabase.auth.getSession();

  if (!userData.session) {
    return (
      <main className="flex justify-center items-center h-screen">
        <AuthDialog open={true} />
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Sta. Clara</h1>
        <div className="flex flex-col gap-2">
          <Link href="/secret-1">
            <Button variant="outline" className="w-full">
              Secret Page 1
            </Button>
          </Link>
          <Link href="/secret-2">
            <Button variant="outline" className="w-full">
              Secret Page 2
            </Button>
          </Link>
          <Link href="/secret-3">
            <Button variant="outline" className="w-full">
              Secret Page 3
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
