import { NextResponse } from "next/server";
import { createClient } from "../../uzklausa/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Tikriname, ar pakvietimo sesija tikrai egzistuoja.
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    return NextResponse.redirect(
      new URL(
        "/prisijungti?error=invalid_invite",
        request.url
      ),
      303
    );
  }

  const formData = await request.formData();

  const password = String(
    formData.get("password") ?? ""
  );

  const passwordConfirm = String(
    formData.get("passwordConfirm") ?? ""
  );

  // Serverio pusės patikrinimas.
  if (password.length < 12) {
    return NextResponse.redirect(
      new URL(
        "/nustatyti-slaptazodi?error=password_length",
        request.url
      ),
      303
    );
  }

  if (password !== passwordConfirm) {
    return NextResponse.redirect(
      new URL(
        "/nustatyti-slaptazodi?error=password_mismatch",
        request.url
      ),
      303
    );
  }

  // Papildomai tikriname, ar vartotojas tikrai
  // susietas su bent vienu klientu.
  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("client_memberships")
    .select("client_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    return NextResponse.redirect(
      new URL(
        "/prisijungti?error=no_client_access",
        request.url
      ),
      303
    );
  }

  // Slaptažodį keičiame dabartiniam
  // autentifikuotam vartotojui.
  const {
    error: updateError,
  } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return NextResponse.redirect(
      new URL(
        "/nustatyti-slaptazodi?error=update_failed",
        request.url
      ),
      303
    );
  }

  return NextResponse.redirect(
    new URL(
      "/savitarnos?password_set=1",
      request.url
    ),
    303
  );
}