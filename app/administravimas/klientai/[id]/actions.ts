"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../uzklausa/lib/supabase/server";
import { createAdminClient } from "../../../uzklausa/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const adminUserId = claimsData?.claims?.sub;

  if (authError || !adminUserId) {
    redirect("/prisijungti");
  }

  const {
    data: adminProfile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("system_role")
    .eq("id", adminUserId)
    .single();

  if (
    profileError ||
    !adminProfile ||
    adminProfile.system_role !== "admin"
  ) {
    throw new Error(
      "Šį veiksmą gali atlikti tik administratorius."
    );
  }

  return supabase;
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createPortalAccess(
  formData: FormData
) {
  const clientId = String(
    formData.get("clientId") ?? ""
  ).trim();

  if (!clientId) {
    throw new Error("Trūksta kliento ID.");
  }

  const supabase = await requireAdmin();

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id, name, email")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    throw new Error("Klientas nerastas.");
  }

  const email = client.email?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      "Kliento kortelėje nėra el. pašto adreso."
    );
  }

  const {
    data: existingMemberships,
    error: membershipCheckError,
  } = await supabase
    .from("client_memberships")
    .select("user_id")
    .eq("client_id", client.id)
    .limit(1);

  if (membershipCheckError) {
    throw new Error(
      "Nepavyko patikrinti kliento savitarnos prieigos."
    );
  }

  if (
    existingMemberships &&
    existingMemberships.length > 0
  ) {
    throw new Error(
      "Šiam klientui prieiga prie savitarnos jau sukurta."
    );
  }

  const adminSupabase = createAdminClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const {
    data: inviteData,
    error: inviteError,
  } =
    await adminSupabase.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: client.name,
          client_id: client.id,
        },
        redirectTo: `${siteUrl}/nustatyti-slaptazodi`,
      }
    );

  if (inviteError) {
    throw new Error(
      `Nepavyko sukurti kliento pakvietimo: ${inviteError.message}`
    );
  }

  const invitedUserId = inviteData.user?.id;

  if (!invitedUserId) {
    throw new Error(
      "Supabase sukūrė pakvietimą, bet negrąžino vartotojo ID."
    );
  }

  const { error: linkError } = await supabase.rpc(
    "admin_link_user_to_client",
    {
      p_client_id: client.id,
      p_user_id: invitedUserId,
    }
  );

  if (linkError) {
    const { error: cleanupError } =
      await adminSupabase.auth.admin.deleteUser(
        invitedUserId
      );

    if (cleanupError) {
      throw new Error(
        `Nepavyko susieti vartotojo su klientu (${linkError.message}). ` +
          "Taip pat nepavyko automatiškai pašalinti dalinai sukurtos Auth paskyros."
      );
    }

    throw new Error(
      `Nepavyko susieti vartotojo su klientu: ${linkError.message}`
    );
  }

  revalidatePath(
    `/administravimas/klientai/${client.id}`
  );

  redirect(
    `/administravimas/klientai/${client.id}?invited=1`
  );
}

export async function resendPortalPasswordLink(
  formData: FormData
) {
  const clientId = String(
    formData.get("clientId") ?? ""
  ).trim();

  if (!clientId) {
    throw new Error("Trūksta kliento ID.");
  }

  const supabase = await requireAdmin();

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id, email")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    throw new Error("Klientas nerastas.");
  }

  const email = client.email?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      "Kliento kortelėje nėra el. pašto adreso."
    );
  }

  const {
    data: memberships,
    error: membershipError,
  } = await supabase
    .from("client_memberships")
    .select("user_id")
    .eq("client_id", client.id)
    .limit(1);

  if (membershipError) {
    throw new Error(
      "Nepavyko patikrinti kliento savitarnos prieigos."
    );
  }

  if (!memberships || memberships.length === 0) {
    throw new Error(
      "Šiam klientui savitarnos prieiga dar nesukurta."
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { error: resetError } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${siteUrl}/nustatyti-slaptazodi`,
      }
    );

  if (resetError) {
    throw new Error(
      `Nepavyko išsiųsti slaptažodžio nustatymo nuorodos: ${resetError.message}`
    );
  }

  revalidatePath(
    `/administravimas/klientai/${client.id}`
  );

  redirect(
    `/administravimas/klientai/${client.id}?password_link_sent=1`
  );
}

export async function updatePortalEmail(
  formData: FormData
) {
  const clientId = String(
    formData.get("clientId") ?? ""
  ).trim();

  const newEmail = normalizeEmail(
    formData.get("email")
  );

  if (!clientId) {
    throw new Error("Trūksta kliento ID.");
  }

  if (!newEmail || !isValidEmail(newEmail)) {
    throw new Error(
      "Įveskite galiojantį el. pašto adresą."
    );
  }

  // Svarbu: pirmiausia visada patikriname,
  // kad veiksmą atlieka administratorius.
  const supabase = await requireAdmin();

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id, email")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    throw new Error("Klientas nerastas.");
  }

  const {
    data: memberships,
    error: membershipError,
  } = await supabase
    .from("client_memberships")
    .select("user_id")
    .eq("client_id", client.id);

  if (membershipError) {
    throw new Error(
      "Nepavyko patikrinti kliento savitarnos paskyros."
    );
  }

  if (!memberships || memberships.length === 0) {
    throw new Error(
      "Šiam klientui savitarnos prieiga dar nesukurta."
    );
  }

  /*
    Kol administravimo sąsajoje neturime atskiro
    kelių naudotojų valdymo, el. paštą leidžiame
    keisti tik klientui, turinčiam vieną susietą
    savitarnos naudotoją.

    Taip nepasirinksime netinkamos Auth paskyros.
  */
  if (memberships.length !== 1) {
    throw new Error(
      "Klientas turi daugiau nei vieną savitarnos naudotoją. " +
        "El. paštą reikia keisti konkrečiam naudotojui."
    );
  }

  const authUserId = memberships[0].user_id;

  if (!authUserId) {
    throw new Error(
      "Nepavyko nustatyti kliento Auth vartotojo."
    );
  }

  const adminSupabase = createAdminClient();

  /*
    Paimame dabartinį Auth vartotoją, kad:
    1. žinotume jo tikrą dabartinį el. paštą;
    2. galėtume jį grąžinti, jei clients atnaujinimas
       po Auth pakeitimo nepavyktų.
  */
  const {
    data: authUserData,
    error: authUserError,
  } =
    await adminSupabase.auth.admin.getUserById(
      authUserId
    );

  if (authUserError || !authUserData.user) {
    throw new Error(
      "Nepavyko rasti kliento prisijungimo paskyros."
    );
  }

  const oldAuthEmail =
    authUserData.user.email?.trim().toLowerCase();

  if (!oldAuthEmail) {
    throw new Error(
      "Kliento prisijungimo paskyroje nėra el. pašto adreso."
    );
  }

  const oldClientEmail =
    client.email?.trim().toLowerCase() ?? "";

  /*
    Jei abu įrašai jau turi norimą adresą,
    nieko papildomai nekeičiam.
  */
  if (
    oldAuthEmail === newEmail &&
    oldClientEmail === newEmail
  ) {
    revalidatePath(
      `/administravimas/klientai/${client.id}`
    );

    redirect(
      `/administravimas/klientai/${client.id}?email_updated=1`
    );
  }

  /*
    Auth el. paštą keičiame tik per Supabase
    administravimo API, o ne tiesioginiu
    auth.users UPDATE.
  */
  if (oldAuthEmail !== newEmail) {
    const { error: authUpdateError } =
      await adminSupabase.auth.admin.updateUserById(
        authUserId,
        {
          email: newEmail,
          email_confirm: true,
        }
      );

    if (authUpdateError) {
      throw new Error(
        `Nepavyko pakeisti prisijungimo el. pašto: ${authUpdateError.message}`
      );
    }
  }

  /*
    Tik po sėkmingo Auth pakeitimo
    sinchronizuojame clients lentelę.
  */
  const { error: clientUpdateError } =
    await supabase
      .from("clients")
      .update({
        email: newEmail,
      })
      .eq("id", client.id);

  if (clientUpdateError) {
    /*
      Auth jau galėjo būti pakeistas.
      Bandome saugiai grąžinti ankstesnį adresą,
      kad Auth ir clients neliktų skirtingi.
    */
    if (oldAuthEmail !== newEmail) {
      const { error: rollbackError } =
        await adminSupabase.auth.admin.updateUserById(
          authUserId,
          {
            email: oldAuthEmail,
            email_confirm: true,
          }
        );

      if (rollbackError) {
        throw new Error(
          "Kliento kortelės el. pašto atnaujinti nepavyko, " +
            "o Auth el. pašto automatiškai grąžinti taip pat nepavyko. " +
            "Reikia administratoriaus patikrinimo."
        );
      }
    }

    throw new Error(
      `Kliento el. pašto atnaujinti nepavyko: ${clientUpdateError.message}`
    );
  }

  revalidatePath(
    `/administravimas/klientai/${client.id}`
  );

  redirect(
    `/administravimas/klientai/${client.id}?email_updated=1`
  );
}