import { NextRequest, NextResponse } from "next/server";

type InquiryPayload = {
  clientType?: string;
  contactName?: string;
  companyName?: string | null;
  companyCode?: string | null;
  vatCode?: string | null;
  email?: string;
  phone?: string;
  objectLocation?: string | null;
  message?: string;
  serviceIds?: string[];
  privacyConsent?: boolean;
  website?: string;
  turnstileToken?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

const globalForRateLimit = globalThis as typeof globalThis & {
  arvigitaInquiryRateLimit?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalForRateLimit.arvigitaInquiryRateLimit ??
  new Map<string, RateLimitEntry>();

globalForRateLimit.arvigitaInquiryRateLimit = rateLimitStore;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "Arvigita <noreply@arvigita.lt>";
const MAIL_TO = process.env.MAIL_TO || "info.arvigita@gmail.com";

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\0/g, "")
    .slice(0, maxLength);
}

function cleanOptionalText(value: unknown, maxLength: number) {
  const cleaned = cleanText(value, maxLength);
  return cleaned || null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[0-9+\s().-]{6,30}$/.test(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000)
      ),
    };
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - current.count,
    retryAfterSeconds: 0,
  };
}

function cleanExpiredRateLimits() {
  const now = Date.now();

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

async function verifyTurnstile(token: string, remoteIp: string) {
  if (!TURNSTILE_SECRET_KEY) {
    console.error("Trūksta TURNSTILE_SECRET_KEY serverio konfigūracijos.");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    if (remoteIp && remoteIp !== "unknown") {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Turnstile Siteverify HTTP klaida:", response.status);
      return false;
    }

    const result = (await response.json()) as TurnstileResponse;

    if (!result.success) {
      console.warn("Turnstile patikra atmesta:", result["error-codes"] ?? []);
      return false;
    }

    const allowedHostnames = new Set([
      "arvigita.lt",
      "www.arvigita.lt",
      "localhost",
    ]);

    if (result.hostname && !allowedHostnames.has(result.hostname)) {
      console.warn("Turnstile grąžino neleistiną hostname:", result.hostname);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile patikros klaida:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (rateLimitStore.size > 500) {
      cleanExpiredRateLimits();
    }

    const clientIp = getClientIp(request);

    if (!SUPABASE_URL || !SUPABASE_KEY || !TURNSTILE_SECRET_KEY) {
      console.error("Trūksta serverio konfigūracijos.");

      return NextResponse.json(
        { error: "Serverio konfigūracijos klaida." },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Netinkamas užklausos formatas." },
        { status: 415 }
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") ?? "0"
    );

    if (Number.isFinite(contentLength) && contentLength > 25_000) {
      return NextResponse.json(
        { error: "Užklausa per didelė." },
        { status: 413 }
      );
    }

    const rawBody = (await request.json()) as InquiryPayload;

    if (cleanText(rawBody.website, 200)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const turnstileToken = cleanText(rawBody.turnstileToken, 4096);

    if (!turnstileToken) {
      return NextResponse.json(
        {
          error:
            "Nepavyko patvirtinti saugumo patikros. Atnaujinkite puslapį ir bandykite dar kartą.",
        },
        { status: 400 }
      );
    }

    const turnstileValid = await verifyTurnstile(turnstileToken, clientIp);

    if (!turnstileValid) {
      return NextResponse.json(
        {
          error:
            "Saugumo patikra nepavyko. Atnaujinkite puslapį ir bandykite dar kartą.",
        },
        { status: 403 }
      );
    }

    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Per daug užklausų. Palaukite kelias minutes ir bandykite dar kartą.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const clientType =
      rawBody.clientType === "company"
        ? "company"
        : rawBody.clientType === "individual"
        ? "individual"
        : "";

    const contactName = cleanText(rawBody.contactName, 120);
    const companyName =
      clientType === "company" ? cleanOptionalText(rawBody.companyName, 200) : null;
    const companyCode =
      clientType === "company" ? cleanOptionalText(rawBody.companyCode, 50) : null;
    const vatCode =
      clientType === "company" ? cleanOptionalText(rawBody.vatCode, 50) : null;
    const email = cleanText(rawBody.email, 254).toLowerCase();
    const phone = cleanText(rawBody.phone, 30);
    const objectLocation = cleanOptionalText(rawBody.objectLocation, 300);
    const message = cleanText(rawBody.message, 5000);
    const privacyConsent = rawBody.privacyConsent === true;

    const serviceIds = Array.isArray(rawBody.serviceIds)
      ? [
          ...new Set(
            rawBody.serviceIds
              .filter((value): value is string => typeof value === "string" && isUuid(value))
              .slice(0, 20)
          ),
        ]
      : [];

    if (!clientType) {
      return NextResponse.json({ error: "Pasirinkite kliento tipą." }, { status: 400 });
    }
    if (contactName.length < 2 || contactName.length > 120) {
      return NextResponse.json({ error: "Nurodykite vardą arba kontaktinį asmenį." }, { status: 400 });
    }
    if (clientType === "company" && !companyName) {
      return NextResponse.json({ error: "Nurodykite įmonės pavadinimą." }, { status: 400 });
    }
    if (clientType === "company" && !companyCode) {
      return NextResponse.json({ error: "Nurodykite įmonės kodą." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Nurodykite galiojantį el. pašto adresą." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Nurodykite galiojantį telefono numerį." }, { status: 400 });
    }
    if (serviceIds.length === 0) {
      return NextResponse.json({ error: "Pasirinkite bent vieną paslaugą." }, { status: 400 });
    }
    if (message.length < 5 || message.length > 5000) {
      return NextResponse.json({ error: "Trumpai aprašykite savo poreikį." }, { status: 400 });
    }
    if (!privacyConsent) {
      return NextResponse.json({ error: "Būtinas sutikimas su privatumo politika." }, { status: 400 });
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/submit_inquiry`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_client_type: clientType,
          p_contact_name: contactName,
          p_company_name: companyName,
          p_company_code: companyCode,
          p_vat_code: vatCode,
          p_email: email,
          p_phone: phone,
          p_object_location: objectLocation,
          p_message: message,
          p_service_ids: serviceIds,
          p_privacy_consent: privacyConsent,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const supabaseError = await response.text();
      console.error("Supabase submit_inquiry klaida:", response.status, supabaseError);

      return NextResponse.json(
        { error: "Užklausos pateikti nepavyko. Bandykite dar kartą." },
        { status: 500 }
      );
    }

    /*
     * SIUNČIAME EL. LAIŠKĄ PER RESEND
     */
    if (RESEND_API_KEY) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: MAIL_FROM,
            to: [MAIL_TO],
            subject: `Nauja užklausa iš arvigita.lt (${contactName})`,
            html: `
              <h2>Gauta nauja užklausa svetainėje arvigita.lt</h2>
              <p><b>Kliento tipas:</b> ${clientType === "company" ? "Įmonė" : "Privatus asmuo"}</p>
              <p><b>Vardas / Kontaktas:</b> ${contactName}</p>
              ${companyName ? `<p><b>Įmonė:</b> ${companyName} (Kodas: ${companyCode ?? "-"}, PVM: ${vatCode ?? "-"})</p>` : ""}
              <p><b>El. paštas:</b> ${email}</p>
              <p><b>Telefonas:</b> ${phone}</p>
              ${objectLocation ? `<p><b>Objekto vieta:</b> ${objectLocation}</p>` : ""}
              <p><b>Žinutė / Aprašymas:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
            `,
          }),
        });

        if (!emailRes.ok) {
          const emailErrText = await emailRes.text();
          console.error("Resend el. pašto siuntimo klaida:", emailRes.status, emailErrText);
        }
      } catch (mailError) {
        console.error("Klaida siunčiant el. laišką per Resend:", mailError);
      }
    } else {
      console.warn("RESEND_API_KEY nenustatytas, el. laiškas nebuvo išsiųstas.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Užklausa sėkmingai pateikta.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Užklausos API klaida:", error);

    return NextResponse.json(
      { error: "Užklausos pateikti nepavyko. Bandykite dar kartą." },
      { status: 500 }
    );
  }
}