"use server";

import { redirect } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";

const BUCKET_NAME = "Client-documents";

export async function openClientDocument(
  formData: FormData
) {
  const supabase = await createClient();

  // Prisijungimo patikra
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  const documentId = String(
    formData.get("document_id") ?? ""
  ).trim();

  const projectId = String(
    formData.get("project_id") ?? ""
  ).trim();

  if (!documentId || !projectId) {
    throw new Error(
      "Trūksta dokumento duomenų."
    );
  }

  /*
    Čia specialiai NENAUDOJAME admin teisių
    ir NENAUDOJAME service_role.

    Užklausa vykdoma kaip prisijungęs klientas,
    todėl public.documents RLS turi nuspręsti,
    ar šis naudotojas gali matyti dokumentą.

    RLS klientui leidžia tik:
      visibility = 'client'
    ir tik jo client_memberships dokumentus.
  */
  const {
    data: document,
    error: documentError,
  } = await supabase
    .from("documents")
    .select(`
      id,
      project_id,
      client_id,
      storage_path,
      original_filename,
      visibility
    `)
    .eq("id", documentId)
    .eq("project_id", projectId)
    .eq("visibility", "client")
    .maybeSingle();

  if (documentError) {
    throw new Error(
      `Nepavyko patikrinti dokumento: ${documentError.message}`
    );
  }

  if (!document) {
    throw new Error(
      "Dokumentas nerastas arba neturite teisės jo peržiūrėti."
    );
  }

  if (!document.storage_path) {
    throw new Error(
      "Dokumento failas nerastas."
    );
  }

  /*
    Storage taip pat turi savo RLS.

    Net jeigu kas nors bandytų pakeisti
    document_id ar storage_path,
    Storage SELECT politika papildomai
    tikrina client_memberships ir
    documents.visibility = 'client'.
  */
  const {
    data: signedUrlData,
    error: signedUrlError,
  } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(
      document.storage_path,
      60
    );

  if (
    signedUrlError ||
    !signedUrlData?.signedUrl
  ) {
    throw new Error(
      "Dokumento atidaryti nepavyko."
    );
  }

  redirect(signedUrlData.signedUrl);
}