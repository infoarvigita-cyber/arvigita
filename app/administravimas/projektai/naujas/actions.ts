"use server";

import { redirect } from "next/navigation";

import { createClient } from "../../../uzklausa/lib/supabase/server";

export async function createProject(formData: FormData) {
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

  // 3. Paimame formos duomenis
  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const objectAddress = String(
    formData.get("object_address") ?? ""
  ).trim();

  const status = String(
    formData.get("status") ?? "planned"
  ).trim();

  const startDate = String(
    formData.get("start_date") ?? ""
  ).trim();

  const plannedEndDate = String(
    formData.get("planned_end_date") ?? ""
  ).trim();

  const clientId = String(
    formData.get("client_id") ?? ""
  ).trim();

  const serviceIds = formData
    .getAll("service_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  // 4. Bazinis duomenų tikrinimas
  if (!name) {
    throw new Error(
      "Nenurodytas projekto pavadinimas."
    );
  }

  if (!clientId) {
    throw new Error(
      "Projektui turi būti pasirinktas klientas."
    );
  }

  const allowedStatuses = [
    "planned",
    "active",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Neteisinga projekto būsena."
    );
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

  // 5. Patikriname, ar klientas egzistuoja
  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    throw new Error(
      "Pasirinktas klientas nerastas."
    );
  }

  // 6. Jei pasirinktos paslaugos, patikriname jas DB
  if (serviceIds.length > 0) {
    const uniqueServiceIds = [
      ...new Set(serviceIds),
    ];

    const {
      data: validServices,
      error: servicesError,
    } = await supabase
      .from("services")
      .select("id")
      .in("id", uniqueServiceIds);

    if (servicesError) {
      throw new Error(
        "Nepavyko patikrinti pasirinktų paslaugų."
      );
    }

    if (
      !validServices ||
      validServices.length !== uniqueServiceIds.length
    ) {
      throw new Error(
        "Viena ar daugiau pasirinktų paslaugų neegzistuoja."
      );
    }
  }

  // 7. Sukuriame projektą
  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .insert({
      name,
      object_address: objectAddress || null,
      status,
      start_date: startDate || null,
      planned_end_date: plannedEndDate || null,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    throw new Error(
      `Nepavyko sukurti projekto: ${
        projectError?.message ??
        "nežinoma klaida"
      }`
    );
  }

  // 8. Susiejame projektą su klientu
  const { error: clientLinkError } =
    await supabase
      .from("project_clients")
      .insert({
        project_id: project.id,
        client_id: clientId,
      });

  if (clientLinkError) {
    // Jei nepavyko susieti kliento,
    // nepaliekame nepilno projekto.
    await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    throw new Error(
      `Projektas sukurtas, tačiau nepavyko susieti kliento: ${clientLinkError.message}`
    );
  }

  // 9. Priskiriame pasirinktas paslaugas
  if (serviceIds.length > 0) {
    const uniqueServiceIds = [
      ...new Set(serviceIds),
    ];

    const serviceRows = uniqueServiceIds.map(
      (serviceId) => ({
        project_id: project.id,
        service_id: serviceId,
      })
    );

    const { error: serviceLinkError } =
      await supabase
        .from("project_services")
        .insert(serviceRows);

    if (serviceLinkError) {
      /*
        Bandome grąžinti sistemą į pradinę būseną,
        kad neliktų dalinai sukurto projekto.
      */
      await supabase
        .from("project_clients")
        .delete()
        .eq("project_id", project.id);

      await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      throw new Error(
        `Nepavyko priskirti projekto paslaugų: ${serviceLinkError.message}`
      );
    }
  }

  // 10. Atidarome ką tik sukurtą projekto kortelę
  redirect(
    `/administravimas/projektai/${project.id}?created=1`
  );
}