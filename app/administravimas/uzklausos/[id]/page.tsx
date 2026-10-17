import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";
import {
  createClientFromInquiry,
  updateInquiryStatus,
} from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function clientTypeLabel(type: string) {
  if (type === "individual") return "Fizinis asmuo";
  if (type === "company") return "Juridinis asmuo";
  return type;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "Nauja",
    contacted: "Susisiekta",
    preparing_offer: "Ruošiamas pasiūlymas",
    offer_sent: "Pasiūlymas išsiųstas",
    accepted: "Priimta",
    rejected: "Atmesta",
  };

  return labels[status] ?? status;
}

export default async function UzklausaPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select(`
      id,
      client_type,
      contact_name,
      company_name,
      company_code,
      vat_code,
      email,
      phone,
      object_location,
      message,
      status,
      privacy_consent,
      privacy_consent_at,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single();

  if (error || !inquiry) {
    notFound();
  }

  const { data: selectedServices } = await supabase
    .from("inquiry_services")
    .select(`
      service_id,
      services (
        id,
        name,
        category,
        description
      )
    `)
    .eq("inquiry_id", id);

  let existingClient: {
    id: string;
    name: string;
    email: string | null;
    company_code: string | null;
  } | null = null;

  if (
    inquiry.client_type === "company" &&
    inquiry.company_code
  ) {
    const { data: companyClient } = await supabase
      .from("clients")
      .select("id, name, email, company_code")
      .eq("company_code", inquiry.company_code.trim())
      .maybeSingle();

    existingClient = companyClient;
  }

  if (!existingClient && inquiry.email) {
    const { data: emailClients } = await supabase
      .from("clients")
      .select("id, name, email, company_code")
      .ilike("email", inquiry.email.trim())
      .limit(1);

    existingClient = emailClients?.[0] ?? null;
  }

  return (
    <main className="container admin-content">
      <Link
        href="/administravimas/uzklausos"
        className="admin-back-link"
      >
        ← Grįžti į užklausas
      </Link>

      <div className="admin-detail-heading">
        <div>
          <span className="section-label">
            UŽKLAUSOS INFORMACIJA
          </span>

          <h1>
            {inquiry.client_type === "company"
              ? inquiry.company_name || inquiry.contact_name
              : inquiry.contact_name}
          </h1>

          <p>
            Užklausa pateikta {formatDate(inquiry.created_at)}
          </p>
        </div>

        <span
          className={`admin-status admin-status-large admin-status-${inquiry.status}`}
        >
          {statusLabel(inquiry.status)}
        </span>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Kliento duomenys</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Kliento tipas</dt>
              <dd>{clientTypeLabel(inquiry.client_type)}</dd>
            </div>

            <div>
              <dt>Kontaktinis asmuo</dt>
              <dd>{inquiry.contact_name}</dd>
            </div>

            {inquiry.client_type === "company" && (
              <>
                <div>
                  <dt>Įmonės pavadinimas</dt>
                  <dd>{inquiry.company_name || "—"}</dd>
                </div>

                <div>
                  <dt>Įmonės kodas</dt>
                  <dd>{inquiry.company_code || "—"}</dd>
                </div>

                <div>
                  <dt>PVM mokėtojo kodas</dt>
                  <dd>{inquiry.vat_code || "—"}</dd>
                </div>
              </>
            )}

            <div>
              <dt>El. paštas</dt>
              <dd>
                <a href={`mailto:${inquiry.email}`}>
                  {inquiry.email}
                </a>
              </dd>
            </div>

            <div>
              <dt>Telefonas</dt>
              <dd>
                {inquiry.phone ? (
                  <a href={`tel:${inquiry.phone}`}>
                    {inquiry.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="admin-detail-card">
          <h2>Objektas ir užklausa</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Objekto vieta</dt>
              <dd>{inquiry.object_location || "—"}</dd>
            </div>

            <div>
              <dt>Dabartinė būsena</dt>
              <dd>{statusLabel(inquiry.status)}</dd>
            </div>

            <div>
              <dt>Pateikta</dt>
              <dd>{formatDate(inquiry.created_at)}</dd>
            </div>

            <div>
              <dt>Atnaujinta</dt>
              <dd>{formatDate(inquiry.updated_at)}</dd>
            </div>
          </dl>

          <div className="admin-message-block">
            <h3>Kliento žinutė</h3>
            <p>
              {inquiry.message ||
                "Klientas papildomos žinutės nepateikė."}
            </p>
          </div>
        </section>
      </div>

      <section className="admin-detail-card admin-detail-section">
        <h2>Pasirinktos paslaugos</h2>

        {!selectedServices?.length ? (
          <p className="admin-muted">
            Paslaugų prie šios užklausos nepriskirta.
          </p>
        ) : (
          <div className="admin-selected-services">
            {selectedServices.map((item) => {
              const service = Array.isArray(item.services)
                ? item.services[0]
                : item.services;

              if (!service) return null;

              return (
                <article
                  key={item.service_id}
                  className="admin-selected-service"
                >
                  <strong>{service.name}</strong>

                  {service.description && (
                    <p>{service.description}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-detail-card admin-detail-section">
        <h2>Privatumo sutikimas</h2>

        <dl className="admin-data-list">
          <div>
            <dt>Sutikimas</dt>
            <dd>
              {inquiry.privacy_consent
                ? "Sutikimas pateiktas"
                : "Sutikimas nepateiktas"}
            </dd>
          </div>

          <div>
            <dt>Sutikimo data</dt>
            <dd>{formatDate(inquiry.privacy_consent_at)}</dd>
          </div>
        </dl>
      </section>

      <section className="admin-detail-card admin-detail-section">
        <h2>Užklausos būsena</h2>

        <form
          action={updateInquiryStatus}
          className="admin-status-form"
        >
          <input
            type="hidden"
            name="inquiryId"
            value={inquiry.id}
          />

          <label htmlFor="status">
            Keisti užklausos būseną
          </label>

          <select
            id="status"
            name="status"
            defaultValue={inquiry.status}
          >
            <option value="new">Nauja</option>
            <option value="contacted">Susisiekta</option>
            <option value="preparing_offer">
              Ruošiamas pasiūlymas
            </option>
            <option value="offer_sent">
              Pasiūlymas išsiųstas
            </option>
            <option value="accepted">Priimta</option>
            <option value="rejected">Atmesta</option>
          </select>

          <button
            className="button button-primary"
            type="submit"
          >
            Išsaugoti būseną
          </button>
        </form>
      </section>

      <section className="admin-actions-card">
        <div>
          <h2>Klientas ir pasiūlymas</h2>

          {existingClient ? (
            <p>
              Klientas <strong>{existingClient.name}</strong>{" "}
              jau yra sistemoje. Šiai užklausai galima
              pradėti rengti pasiūlymą.
            </p>
          ) : (
            <p>
              Prieš kuriant pasiūlymą iš šios užklausos
              pirmiausia reikia sukurti klientą.
            </p>
          )}
        </div>

        <div className="admin-actions">
          {existingClient ? (
            <>
              <Link
                href={`/administravimas/klientai/${existingClient.id}`}
                className="button admin-secondary-button"
              >
                Atidaryti klientą
              </Link>

              <Link
                href={`/administravimas/pasiulymai/naujas?inquiryId=${inquiry.id}&clientId=${existingClient.id}`}
                className="button button-primary"
              >
                Kurti pasiūlymą
              </Link>
            </>
          ) : (
            <form action={createClientFromInquiry}>
              <input
                type="hidden"
                name="inquiryId"
                value={inquiry.id}
              />

              <button
                type="submit"
                className="button button-primary"
              >
                Sukurti klientą
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}