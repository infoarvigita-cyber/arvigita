"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";

const allowedStatuses = [
  "new",
  "contacted",
  "preparing_offer",
  "offer_sent",
  "accepted",
  "rejected",
] as const;

export async function updateInquiryStatus(
  formData: FormData
) {
  const inquiryId = String(
    formData.get("inquiryId") ?? ""
  );

  const status = String(
    formData.get("status") ?? ""
  );

  if (
    !inquiryId ||
    !allowedStatuses.includes(
      status as (typeof allowedStatuses)[number]
    )
  ) {
    throw new Error(
      "Neteisingas užklausos ID arba būsena."
    );
  }

  const supabase = await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    throw new Error(
      "Administratoriaus sesija nerasta."
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id, system_role")
      .eq("id", userId)
      .single();

  if (profileError || !profile) {
    throw new Error(
      "Nepavyko patikrinti administratoriaus profilio."
    );
  }

  if (profile.system_role !== "admin") {
    throw new Error(
      "Šiam veiksmui reikalingos administratoriaus teisės."
    );
  }

  const { error } = await supabase.rpc(
    "admin_update_inquiry_status",
    {
      p_inquiry_id: inquiryId,
      p_status: status,
    }
  );

  if (error) {
    throw new Error(
      `Nepavyko pakeisti užklausos būsenos: ${error.message}`
    );
  }

  revalidatePath(
    `/administravimas/uzklausos/${inquiryId}`
  );

  revalidatePath("/administravimas/uzklausos");
  revalidatePath("/administravimas");
}

export async function createClientFromInquiry(
  formData: FormData
) {
  const inquiryId = String(
    formData.get("inquiryId") ?? ""
  );

  if (!inquiryId) {
    throw new Error("Nenurodytas užklausos ID.");
  }

  const supabase = await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    throw new Error(
      "Administratoriaus sesija nerasta."
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id, system_role")
      .eq("id", userId)
      .single();

  if (
    profileError ||
    !profile ||
    profile.system_role !== "admin"
  ) {
    throw new Error(
      "Šiam veiksmui reikalingos administratoriaus teisės."
    );
  }

  const { data: clientId, error } =
    await supabase.rpc(
      "admin_create_client_from_inquiry",
      {
        p_inquiry_id: inquiryId,
      }
    );

  if (error) {
    throw new Error(
      `Nepavyko sukurti kliento: ${error.message}`
    );
  }

  if (!clientId) {
    throw new Error(
      "Sistema negrąžino kliento ID."
    );
  }

  revalidatePath("/administravimas");
  revalidatePath("/administravimas/uzklausos");
  revalidatePath("/administravimas/klientai");

  redirect("/administravimas/klientai");
}