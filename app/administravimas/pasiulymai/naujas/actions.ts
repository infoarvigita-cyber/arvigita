"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";

type OfferItem = {
  service_id: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  vat_rate: number;
};

function readNumber(
  formData: FormData,
  name: string,
  fallback: number
) {
  const raw = String(formData.get(name) ?? "")
    .trim()
    .replace(",", ".");

  if (!raw) return fallback;

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Neteisinga skaitinė reikšmė: ${name}`);
  }

  return value;
}

export async function createOffer(formData: FormData) {
  const inquiryId = String(
    formData.get("inquiryId") ?? ""
  ).trim();

  const clientId = String(
    formData.get("clientId") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const validUntilRaw = String(
    formData.get("validUntil") ?? ""
  ).trim();

  const notes = String(
    formData.get("notes") ?? ""
  ).trim();

  if (!inquiryId || !clientId) {
    throw new Error(
      "Trūksta užklausos arba kliento duomenų."
    );
  }

  if (!title) {
    throw new Error("Įrašykite pasiūlymo pavadinimą.");
  }

  const itemIndexes = Array.from(
    new Set(
      Array.from(formData.keys())
        .map((key) => {
          const match = key.match(
            /^item-(\d+)-description$/
          );

          return match ? Number(match[1]) : null;
        })
        .filter(
          (value): value is number =>
            value !== null
        )
    )
  ).sort((a, b) => a - b);

  if (!itemIndexes.length) {
    throw new Error(
      "Pasiūlyme turi būti bent viena pozicija."
    );
  }

  const items: OfferItem[] = itemIndexes.map(
    (index) => {
      const description = String(
        formData.get(
          `item-${index}-description`
        ) ?? ""
      ).trim();

      const unit = String(
        formData.get(`item-${index}-unit`) ?? ""
      ).trim();

      const serviceId = String(
        formData.get(
          `item-${index}-service-id`
        ) ?? ""
      ).trim();

      if (!description) {
        throw new Error(
          `Neįrašytas ${index + 1} pozicijos aprašymas.`
        );
      }

      if (!unit) {
        throw new Error(
          `Neįrašytas ${index + 1} pozicijos mato vienetas.`
        );
      }

      const quantity = readNumber(
        formData,
        `item-${index}-quantity`,
        0
      );

      const unitPrice = readNumber(
        formData,
        `item-${index}-unit-price`,
        -1
      );

      const discountPercent = readNumber(
        formData,
        `item-${index}-discount`,
        0
      );

      const vatRate = readNumber(
        formData,
        `item-${index}-vat`,
        21
      );

      if (quantity <= 0) {
        throw new Error(
          `${index + 1} pozicijos kiekis turi būti didesnis už 0.`
        );
      }

      if (unitPrice < 0) {
        throw new Error(
          `${index + 1} pozicijos kaina negali būti neigiama.`
        );
      }

      if (
        discountPercent < 0 ||
        discountPercent > 100
      ) {
        throw new Error(
          `${index + 1} pozicijos nuolaida turi būti nuo 0 iki 100 %.`
        );
      }

      if (vatRate < 0 || vatRate > 100) {
        throw new Error(
          `${index + 1} pozicijos PVM tarifas neteisingas.`
        );
      }

      return {
        service_id: serviceId || null,
        description,
        quantity,
        unit,
        unit_price: unitPrice,
        discount_percent: discountPercent,
        vat_rate: vatRate,
      };
    }
  );

  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    throw new Error(
      "Administratoriaus sesija nerasta."
    );
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
      "Šiam veiksmui reikalingos administratoriaus teisės."
    );
  }

  const { data: offerId, error } =
    await supabase.rpc("admin_create_offer", {
      p_inquiry_id: inquiryId,
      p_client_id: clientId,
      p_title: title,
      p_valid_until: validUntilRaw || null,
      p_notes: notes || null,
      p_items: items,
    });

  if (error) {
    throw new Error(
      `Nepavyko sukurti pasiūlymo: ${error.message}`
    );
  }

  if (!offerId) {
    throw new Error(
      "Sistema negrąžino pasiūlymo ID."
    );
  }

  redirect(
    `/administravimas/pasiulymai/${offerId}`
  );
}