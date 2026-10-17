import Link from "next/link";
import { createClient } from "../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function clientTypeLabel(type: string) {
  if (type === "individual") return "Fizinis asmuo";
  if (type === "company") return "Juridinis asmuo";

  return type;
}

export default async function KlientaiPage() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select(`
      id,
      client_type,
      name,
      contact_name,
      company_code,
      vat_code,
      email,
      phone,
      address,
      created_at
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="container admin-content">
      <div className="admin-page-heading">
        <span className="section-label">
          ADMINISTRAVIMAS
        </span>

        <h1>Klientai</h1>

        <p>
          Fizinių ir juridinių MB „Arvigita“ klientų
          administravimas.
        </p>
      </div>

      {error ? (
        <div className="admin-error">
          Klientų nepavyko įkelti.
        </div>
      ) : !clients?.length ? (
        <div className="admin-empty">
          <h2>Klientų nėra</h2>

          <p>
            Klientą galėsite sukurti iš gautos užklausos.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Klientas</th>
                <th>Tipas</th>
                <th>Kontaktinis asmuo</th>
                <th>Kontaktai</th>
                <th>Įmonės kodas</th>
                <th>Sukurta</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <strong>{client.name}</strong>

                    {client.client_type === "company" &&
                      client.vat_code && (
                        <div className="admin-table-secondary">
                          PVM: {client.vat_code}
                        </div>
                      )}
                  </td>

                  <td>
                    {clientTypeLabel(client.client_type)}
                  </td>

                  <td>
                    {client.contact_name || "—"}
                  </td>

                  <td>
                    <div>{client.email || "—"}</div>

                    {client.phone && (
                      <div className="admin-table-secondary">
                        {client.phone}
                      </div>
                    )}
                  </td>

                  <td>
                    {client.company_code || "—"}
                  </td>

                  <td>
                    {formatDate(client.created_at)}
                  </td>

                  <td>
                    <Link
                      href={`/administravimas/klientai/${client.id}`}
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
    </main>
  );
}