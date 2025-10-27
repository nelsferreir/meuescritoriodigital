// este layout apenas garante que as rotas dentro de (app) sejam protegidas

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 px-4 py-8 md:px-8 md:py-12 lg:px-10 lg:py-16">
        {children}
    </main>
); }