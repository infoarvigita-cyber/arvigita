import { NextResponse } from "next/server";
import { createClient } from "../uzklausa/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/prisijungti", request.url),
    303
  );
}