import { type NextRequest } from "next/server";
import { updateSession } from "./app/uzklausa/lib/supabase/proxy";

export default async function proxy(request: NextRequest) {
  return updateSession(request);
}