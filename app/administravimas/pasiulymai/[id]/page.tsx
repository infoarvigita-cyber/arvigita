import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";
import { sendOffer } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    submitted?: string;
  }>;
};

function formatMoney(value: number | string | null) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Juodraštis",
    sent: "Pateiktas klientui",
    accepted: "Priimtas",
    rejected: "Atmestas",
    expired: "Nebegalioja",
    cancelled: "Atšauktas",
  };

  return labels[status] ?? status;
}

export default async function PasiulymasPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const { data: offer, error } = await supabase
    .from("offers")
    .select(`
      id,
      offer_number,
      inquiry_id,
      client_id,
      project_id,
      title,
      status,
      sent_at,
      valid_until,
      notes,
      created_at,
      updated_at,
      accepted_at,
      rejected_at,
      admin_confirmed_at,
      admin_confirmed_by,
      clients (
        id,
        client_type,
        name,
        contact_name,
        company_code,
        vat_code,
        email,
        phone,
        address
      )
    `)
    .eq("id", id)
    .single();

  if (error || !offer) {
    notFound();
  }

  const client = Array.isArray(offer.clients)
    ? offer.clients[0]
    : offer.clients;

  const { data: items, error: itemsError } =
    await supabase
      .from("offer_items")
      .select(`
        id,
        service_id,
        description,
        quantity,
        unit,
        unit_price,
        discount_percent,
        vat_rate,
        sort_order
      `)
      .eq("offer_id", id)
      .order("sort_order", { ascending: true });

  const { data: totals } = await supabase
    .from("offer_totals")
    .select(`
      subtotal_excl_vat,
      vat_amount,
      total_incl_vat
    `)
    .eq("offer_id", id)
    .maybeSingle();

  return (
    <main className="container admin-content">
      <Link
        href="/administravimas/pasiulymai"
        className="admin-back-link"
      >
        ← Grįžti į pasiūlymus
      </Link>

      {query.submitted === "1" && offer.status === "sent" && (
        <div className="admin-success">
          Pasiūlymas sėkmingai pateiktas klientui.
          El. laiškas šiame etape nebuvo siunčiamas.
        </div>
      )}

      <div className="admin-detail-heading">
        <div>
          <span className="section-label">
            PASIŪLYMAS
          </span>

          <h1>{offer.offer_number || "Pasiūlymas"}</h1>

          <p>{offer.title}</p>
        </div>

        <span
          className={`admin-status admin-status-large admin-status-${offer.status}`}
        >
          {statusLabel(offer.status)}
        </span>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Klientas</h2>

          {client ? (
            <dl className="admin-data-list">
              <div>
                <dt>Klientas</dt>
                <dd>{client.name}</dd>
              </div>

              {client.client_type === "company" && (
                <>
                  <div>
                    <dt>Įmonės kodas</dt>
                    <dd>{client.company_code || "—"}</dd>
                  </div>

                  <div>
                    <dt>PVM kodas</dt>
                    <dd>{client.vat_code || "—"}</dd>
                  </div>

                  <div>
                    <dt>Kontaktinis asmuo</dt>
                    <dd>{client.contact_name || "—"}</dd>
                  </div>
                </>
              )}

              <div>
                <dt>El. paštas</dt>
                <dd>{client.email || "—"}</dd>
              </div>

              <div>
                <dt>Telefonas</dt>
                <dd>{client.phone || "—"}</dd>
              </div>

              <div>
                <dt>Adresas</dt>
                <dd>{client.address || "—"}</dd>
              </div>
            </dl>
          ) : (
            <p className="admin-muted">
              Klientas nepriskirtas.
            </p>
          )}

          {client && (
            <div className="admin-page-actions">
              <Link
                href={`/administravimas/klientai/${client.id}`}
                className="admin-open-link"
              >
                Atidaryti kliento kortelę →
              </Link>
            </div>
          )}
        </section>

        <section className="admin-detail-card">
          <h2>Pasiūlymo informacija</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Numeris</dt>
              <dd>{offer.offer_number || "—"}</dd>
            </div>

            <div>
              <dt>Būsena</dt>
              <dd>{statusLabel(offer.status)}</dd>
            </div>

            <div>
              <dt>Sukurta</dt>
              <dd>{formatDateTime(offer.created_at)}</dd>
            </div>

            <div>
              <dt>Galioja iki</dt>
              <dd>{formatDate(offer.valid_until)}</dd>
            </div>

            <div>
              <dt>Pateikta klientui</dt>
              <dd>{formatDateTime(offer.sent_at)}</dd>
            </div>

            <div>
              <dt>Kliento priimta</dt>
              <dd>{formatDateTime(offer.accepted_at)}</dd>
            </div>

            <div>
              <dt>Administratoriaus patvirtinta</dt>
              <dd>
                {formatDateTime(offer.admin_confirmed_at)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {offer.notes && (
        <section className="admin-detail-card admin-detail-section">
          <h2>Pastabos ir sąlygos</h2>
          <p>{offer.notes}</p>
        </section>
      )}

      <section className="admin-detail-card admin-detail-section">
        <h2>Pasiūlymo pozicijos</h2>

        {itemsError ? (
          <div className="admin-error">
            Nepavyko įkelti pasiūlymo pozicijų.
          </div>
        ) : !items?.length ? (
          <p className="admin-muted">
            Pasiūlymo pozicijų nėra.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Aprašymas</th>
                  <th>Kiekis</th>
                  <th>Vnt.</th>
                  <th>Kaina be PVM</th>
                  <th>Nuolaida</th>
                  <th>PVM</th>
                  <th>Suma su PVM</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => {
                  const quantity = Number(item.quantity);
                  const unitPrice = Number(item.unit_price);
                  const discount = Number(
                    item.discount_percent
                  );
                  const vat = Number(item.vat_rate);

                  const subtotal =
                    quantity *
                    unitPrice *
                    (1 - discount / 100);

                  const total =
                    subtotal * (1 + vat / 100);

                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.description}</strong>
                      </td>

                      <td>{quantity}</td>
                      <td>{item.unit}</td>

                      <td>{formatMoney(unitPrice)}</td>

                      <td>{discount} %</td>
                      <td>{vat} %</td>

                      <td>
                        <strong>{formatMoney(total)}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="offer-summary-card">
        <div>
          <span>Suma be PVM</span>
          <strong>
            {formatMoney(totals?.subtotal_excl_vat ?? 0)}
          </strong>
        </div>

        <div>
          <span>PVM</span>
          <strong>
            {formatMoney(totals?.vat_amount ?? 0)}
          </strong>
        </div>

        <div className="offer-summary-total">
          <span>Galutinė suma</span>
          <strong>
            {formatMoney(totals?.total_incl_vat ?? 0)}
          </strong>
        </div>
      </section>

      <section className="admin-actions-card">
        <div>
          <h2>Tolimesni veiksmai</h2>

          {offer.status === "draft" ? (
            <p>
              Patikrinkite pasiūlymo informaciją ir sumas.
              Pateikus pasiūlymą klientui, jo būsena bus
              pakeista iš <strong>Juodraštis</strong> į{" "}
              <strong>Pateiktas klientui</strong>.
            </p>
          ) : (
            <p>
              Dabartinė pasiūlymo būsena:{" "}
              <strong>{statusLabel(offer.status)}</strong>.
            </p>
          )}
        </div>

        <div className="admin-actions">
          {offer.inquiry_id && (
            <Link
              href={`/administravimas/uzklausos/${offer.inquiry_id}`}
              className="button admin-secondary-button"
            >
              Atidaryti užklausą
            </Link>
          )}

          {offer.status === "draft" && (
            <form action={sendOffer}>
              <input
                type="hidden"
                name="offerId"
                value={offer.id}
              />

              <button
                type="submit"
                className="button button-primary"
              >
                Pateikti klientui
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}