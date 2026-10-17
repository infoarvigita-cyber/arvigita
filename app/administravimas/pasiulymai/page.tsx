import { createClient } from "../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

function statusLabel(status: string | null) {
  const labels: Record<string, string> = {
    draft: "Juodraštis",
    sent: "Išsiųstas",
    accepted: "Priimtas",
    rejected: "Atmestas",
    confirmed: "Patvirtintas",
  };

  if (!status) return "—";

  return labels[status] ?? status;
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export default async function PasiulymaiPage() {
  const supabase = await createClient();

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="container admin-content">
      <div className="admin-page-heading admin-heading-row">
        <div>
          <span className="section-label">
            ADMINISTRAVIMAS
          </span>

          <h1>Pasiūlymai</h1>

          <p>
            Klientams rengiami ir pateikti komerciniai
            pasiūlymai.
          </p>
        </div>

        <button
          className="button button-primary"
          type="button"
          disabled
        >
          + Naujas pasiūlymas
        </button>
      </div>

      {error ? (
        <div className="admin-error">
          Pasiūlymų nepavyko įkelti.
        </div>
      ) : !offers?.length ? (
        <div className="admin-empty">
          <h2>Pasiūlymų dar nėra</h2>
          <p>
            Sukurti pasiūlymai bus rodomi šiame sąraše.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Būsena</th>
                <th>Sukurta</th>
                <th>Galioja iki</th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td>
                    <strong>
                      {offer.offer_number ?? "—"}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${offer.status ?? "unknown"}`}
                    >
                      {statusLabel(offer.status)}
                    </span>
                  </td>

                  <td>
                    {formatDate(offer.created_at)}
                  </td>

                  <td>
                    {formatDate(
                      offer.valid_until ??
                        offer.expires_at ??
                        null
                    )}
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