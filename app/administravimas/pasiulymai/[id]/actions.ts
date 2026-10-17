"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";

export async function sendOffer(formData: FormData) {
  const offerId = String(
    formData.get("offerId") ?? ""
  ).trim();

  if (!offerId) {
    throw new Error("Trūksta pasiūlymo ID.");
  }

  const supabase = await createClient();

  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("system_role")
      .eq("id", userId)
      .single();

  if (
    profileError ||
    !profile ||
    profile.system_role !== "admin"
  ) {
    throw new Error(
      "Šį veiksmą gali atlikti tik administratorius."
    );
  }

  const { error } = await supabase.rpc(
    "admin_send_offer",
    {
      p_offer_id: offerId,
    }
  );

  if (error) {
    throw new Error(
      `Nepavyko pateikti pasiūlymo: ${error.message}`
    );
  }

  revalidatePath(
    `/administravimas/pasiulymai/${offerId}`
  );
  revalidatePath("/administravimas/pasiulymai");
  revalidatePath("/administravimas/uzklausos");

  redirect(
    `/administravimas/pasiulymai/${offerId}?submitted=1`
  );
}