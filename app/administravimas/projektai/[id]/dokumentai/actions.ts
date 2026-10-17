"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";

const BUCKET_NAME = "Client-documents";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
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

  return {
    supabase,
    userId,
  };
}

export async function uploadProjectDocument(
  formData: FormData
) {
  const { supabase } = await requireAdmin();

  const projectId = String(
    formData.get("project_id") ?? ""
  ).trim();

  const clientId = String(
    formData.get("client_id") ?? ""
  ).trim();

  const documentType = String(
    formData.get("document_type") ?? ""
  ).trim();

  const visibility = String(
    formData.get("visibility") ?? ""
  ).trim();

  const fileValue = formData.get("file");

  if (
    !projectId ||
    !clientId ||
    !documentType
  ) {
    throw new Error(
      "Trūksta dokumento duomenų."
    );
  }

  if (
    visibility !== "admin" &&
    visibility !== "client"
  ) {
    throw new Error(
      "Neteisingas dokumento matomumas."
    );
  }

  if (!(fileValue instanceof File)) {
    throw new Error(
      "Nepasirinktas dokumento failas."
    );
  }

  const file = fileValue;

  if (file.size <= 0) {
    throw new Error(
      "Pasirinktas failas yra tuščias."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Failas per didelis. Maksimalus dydis – 20 MB."
    );
  }

  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    throw new Error(
      "Leidžiami tik PDF, JPG ir PNG failai."
    );
  }

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    throw new Error(
      "Projektas nerastas."
    );
  }

  const {
    data: projectClient,
    error: projectClientError,
  } = await supabase
    .from("project_clients")
    .select("client_id")
    .eq("project_id", projectId)
    .eq("client_id", clientId)
    .maybeSingle();

  if (
    projectClientError ||
    !projectClient
  ) {
    throw new Error(
      "Pasirinktas klientas nepriskirtas šiam projektui."
    );
  }

  const {
    data: documentTypeRow,
    error: documentTypeError,
  } = await supabase
    .from("document_types")
    .select("code")
    .eq("code", documentType)
    .eq("is_active", true)
    .maybeSingle();

  if (
    documentTypeError ||
    !documentTypeRow
  ) {
    throw new Error(
      "Dokumento tipas neegzistuoja arba nėra aktyvus."
    );
  }

  const documentId = crypto.randomUUID();

  const extension =
    file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
        ? "png"
        : "jpg";

  const storageFileName =
    `${crypto.randomUUID()}.${extension}`;

  const storagePath =
    `${clientId}/${projectId}/${storageFileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

  if (uploadError) {
    throw new Error(
      `Nepavyko įkelti failo: ${uploadError.message}`
    );
  }

  const { error: metadataError } =
    await supabase.rpc(
      "admin_create_document",
      {
        p_document_id: documentId,
        p_client_id: clientId,
        p_project_id: projectId,
        p_storage_path: storagePath,
        p_original_filename: file.name,
        p_document_type: documentType,
        p_visibility: visibility,
      }
    );

  if (metadataError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    throw new Error(
      `Failas įkeltas, tačiau dokumento nepavyko užregistruoti: ${metadataError.message}`
    );
  }

  revalidatePath(
    `/administravimas/projektai/${projectId}/dokumentai`
  );

  redirect(
    `/administravimas/projektai/${projectId}/dokumentai?uploaded=1`
  );
}

export async function openProjectDocument(
  formData: FormData
) {
  const { supabase } = await requireAdmin();

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

  const {
    data: document,
    error: documentError,
  } = await supabase
    .from("documents")
    .select(`
      id,
      project_id,
      storage_path,
      original_filename
    `)
    .eq("id", documentId)
    .eq("project_id", projectId)
    .single();

  if (
    documentError ||
    !document
  ) {
    throw new Error(
      "Dokumentas nerastas arba nepriklauso šiam projektui."
    );
  }

  if (!document.storage_path) {
    throw new Error(
      "Dokumento failo kelias nerastas."
    );
  }

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
      `Nepavyko atidaryti dokumento: ${
        signedUrlError?.message ??
        "nepavyko sukurti saugios nuorodos"
      }`
    );
  }

  redirect(signedUrlData.signedUrl);
}

export async function deleteProjectDocument(
  formData: FormData
) {
  const { supabase } = await requireAdmin();

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
    Dokumentą gauname tik tada, jeigu jo ID
    ir projekto ID sutampa.

    Tai apsaugo nuo bandymo per formą nurodyti
    kito projekto dokumentą.
  */
  const {
    data: document,
    error: documentError,
  } = await supabase
    .from("documents")
    .select(`
      id,
      project_id,
      storage_path
    `)
    .eq("id", documentId)
    .eq("project_id", projectId)
    .single();

  if (
    documentError ||
    !document
  ) {
    throw new Error(
      "Dokumentas nerastas arba nepriklauso šiam projektui."
    );
  }

  if (!document.storage_path) {
    throw new Error(
      "Dokumento Storage kelias nerastas."
    );
  }

  /*
    1. Pirmiausia ištriname realų failą
       iš privataus Storage.

    Jei tai nepavyksta, DB įrašo neliečiame.
  */
  const { error: storageDeleteError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([document.storage_path]);

  if (storageDeleteError) {
    throw new Error(
      `Nepavyko ištrinti dokumento failo: ${storageDeleteError.message}`
    );
  }

  /*
    2. Tik po sėkmingo Storage ištrynimo
       pašaliname dokumento įrašą iš DB.
  */
  const {
    error: databaseDeleteError,
  } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("project_id", projectId);

  if (databaseDeleteError) {
    /*
      Šiuo atveju failas jau pašalintas iš Storage,
      todėl klaidos neslepiame.

      Vėliau prieš produkciją šią dviejų sistemų
      operaciją papildysime auditu / atkūrimo strategija.
    */
    throw new Error(
      `Failas ištrintas, tačiau nepavyko pašalinti dokumento įrašo: ${databaseDeleteError.message}`
    );
  }

  revalidatePath(
    `/administravimas/projektai/${projectId}/dokumentai`
  );

  redirect(
    `/administravimas/projektai/${projectId}/dokumentai?deleted=1`
  );
}