"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";

export async function updateProject(formData: FormData) {
  const projectId = String(
    formData.get("projectId") ?? ""
  ).trim();

  if (!projectId) {
    throw new Error("Trūksta projekto ID.");
  }

  const supabase = await createClient();

  // 1. Patikriname prisijungusį naudotoją
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  // 2. Patikriname administratoriaus rolę
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

  // 3. Patikriname, ar projektas egzistuoja
  const {
    data: existingProject,
    error: projectCheckError,
  } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (projectCheckError || !existingProject) {
    throw new Error("Projektas nerastas.");
  }

  // 4. Paimame formos duomenis
  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const objectAddress = String(
    formData.get("object_address") ?? ""
  ).trim();

  const status = String(
    formData.get("status") ?? ""
  ).trim();

  const startDate = String(
    formData.get("start_date") ?? ""
  ).trim();

  const plannedEndDate = String(
    formData.get("planned_end_date") ?? ""
  ).trim();

  const serviceIds = [
    ...new Set(
      formData
        .getAll("service_ids")
        .map((value) => String(value).trim())
        .filter(Boolean)
    ),
  ];

  // 5. Tikriname pagrindinius duomenis
  if (!name) {
    throw new Error(
      "Projekto pavadinimas negali būti tuščias."
    );
  }

  const allowedStatuses = [
    "planned",
    "active",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Neteisinga projekto būsena.");
  }

  if (
    startDate &&
    plannedEndDate &&
    plannedEndDate < startDate
  ) {
    throw new Error(
      "Planuojama pabaigos data negali būti ankstesnė už darbų pradžios datą."
    );
  }

  // 6. Patikriname pasirinktas paslaugas
  if (serviceIds.length > 0) {
    const {
      data: validServices,
      error: servicesError,
    } = await supabase
      .from("services")
      .select("id")
      .eq("is_active", true)
      .in("id", serviceIds);

    if (servicesError) {
      throw new Error(
        "Nepavyko patikrinti pasirinktų paslaugų."
      );
    }

    if (
      !validServices ||
      validServices.length !== serviceIds.length
    ) {
      throw new Error(
        "Viena ar daugiau pasirinktų paslaugų neegzistuoja arba nėra aktyvios."
      );
    }
  }

  // 7. Atnaujiname pagrindinius projekto duomenis
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      name,
      object_address: objectAddress || null,
      status,
      start_date: startDate || null,
      planned_end_date: plannedEndDate || null,
    })
    .eq("id", projectId);

  if (updateError) {
    throw new Error(
      `Nepavyko atnaujinti projekto: ${updateError.message}`
    );
  }

  /*
    8. Atnaujiname projekto paslaugas.

    Kliento ryšio čia neliečiame.
  */
  const { error: deleteServicesError } =
    await supabase
      .from("project_services")
      .delete()
      .eq("project_id", projectId);

  if (deleteServicesError) {
    throw new Error(
      `Projekto duomenys atnaujinti, tačiau nepavyko atnaujinti paslaugų: ${deleteServicesError.message}`
    );
  }

  if (serviceIds.length > 0) {
    const serviceRows = serviceIds.map(
      (serviceId) => ({
        project_id: projectId,
        service_id: serviceId,
      })
    );

    const { error: insertServicesError } =
      await supabase
        .from("project_services")
        .insert(serviceRows);

    if (insertServicesError) {
      throw new Error(
        `Nepavyko išsaugoti projekto paslaugų: ${insertServicesError.message}`
      );
    }
  }

  // 9. Atnaujiname Next.js puslapius
  revalidatePath("/administravimas/projektai");

  revalidatePath(
    `/administravimas/projektai/${projectId}`
  );

  // 10. Grįžtame į projekto kortelę
  redirect(
    `/administravimas/projektai/${projectId}?updated=1`
  );
}