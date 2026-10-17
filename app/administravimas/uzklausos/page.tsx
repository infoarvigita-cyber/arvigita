import Link from "next/link";
import { createClient } from "../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

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

export default async function UzklausosPage() {
  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(`
      id,
      client_type,
      contact_name,
      company_name,
      email,
      phone,
      object_location,
      status,
      created_at
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="container admin-content">
      <div className="admin-page-heading">
        <span className="section-label">
          ADMINISTRAVIMAS
        </span>

        <h1>Užklausos</h1>

        <p>
          Gautos klientų užklausos ir jų administravimo
          būsena.
        </p>
      </div>

      {error ? (
        <div className="admin-error">
          <h2>Nepavyko įkelti užklausų</h2>
          <p>{error.message}</p>
        </div>
      ) : !inquiries?.length ? (
        <div className="admin-empty">
          <h2>Užklausų nėra</h2>
          <p>
            Naujos klientų užklausos bus rodomos šiame
            puslapyje.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Klientas</th>
                <th>Tipas</th>
                <th>Kontaktai</th>
                <th>Objektas</th>
                <th>Būsena</th>
                <th>Gauta</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <strong>
                      {inquiry.client_type === "company"
                        ? inquiry.company_name ||
                          inquiry.contact_name
                        : inquiry.contact_name}
                    </strong>

                    {inquiry.client_type === "company" &&
                      inquiry.company_name && (
                        <div className="admin-table-secondary">
                          Kontaktas:{" "}
                          {inquiry.contact_name}
                        </div>
                      )}
                  </td>

                  <td>
                    {clientTypeLabel(
                      inquiry.client_type
                    )}
                  </td>

                  <td>
                    <div>{inquiry.email}</div>

                    {inquiry.phone && (
                      <div className="admin-table-secondary">
                        {inquiry.phone}
                      </div>
                    )}
                  </td>

                  <td>
                    {inquiry.object_location || "—"}
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${inquiry.status}`}
                    >
                      {statusLabel(inquiry.status)}
                    </span>
                  </td>

                  <td>
                    {formatDate(inquiry.created_at)}
                  </td>

                  <td>
                    <Link
                      href={`/administravimas/uzklausos/${inquiry.id}`}
                      className="admin-open-link"
                    >
                      Atidaryti →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-page-actions">
        <Link
          href="/administravimas"
          className="admin-back-link"
        >
          ← Grįžti į administravimą
        </Link>
      </div>
    </main>
  );
}