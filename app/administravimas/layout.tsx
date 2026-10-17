import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdministravimoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/prisijungti");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, system_role")
    .eq("id", userId)
    .single();

  if (
    profileError ||
    !profile ||
    profile.system_role !== "admin"
  ) {
    redirect("/savitarnos");
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <Link href="/administravimas" className="admin-brand">
            <strong>MB „Arvigita“</strong>
            <span>Administravimo sistema</span>
          </Link>

          <nav className="admin-nav" aria-label="Administravimo navigacija">
            <Link href="/administravimas/uzklausos">
              Užklausos
            </Link>

            <Link href="/administravimas/klientai">
              Klientai
            </Link>

            <Link href="/administravimas/pasiulymai">
              Pasiūlymai
            </Link>

            <Link href="/administravimas/projektai">
              Projektai
            </Link>

            <Link href="/administravimas/paslaugos">
              Paslaugos
            </Link>
          </nav>

          <form action="/atsijungti" method="post">
            <button className="portal-logout" type="submit">
              Atsijungti
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}