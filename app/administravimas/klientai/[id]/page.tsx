import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../../uzklausa/lib/supabase/server";
import {
  createPortalAccess,
  resendPortalPasswordLink,
  updatePortalEmail,
} from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    invited?: string;
    password_link_sent?: string;
    email_updated?: string;
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

export default async function KlientasPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const { data: client, error } = await supabase
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
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single();

  if (error || !client) {
    notFound();
  }

  const { data: projectLinks } = await supabase
    .from("project_clients")
    .select(`
      project_id,
      projects (
        id,
        name,
        status,
        object_address,
        start_date,
        planned_end_date
      )
    `)
    .eq("client_id", id);

  const { data: memberships } = await supabase
    .from("client_memberships")
    .select(`
      user_id,
      membership_role,
      created_at
    `)
    .eq("client_id", id)
    .order("created_at", {
      ascending: true,
    });

  const hasPortalAccess =
    Array.isArray(memberships) &&
    memberships.length > 0;

  return (
    <main className="container admin-content">
      <Link
        href="/administravimas/klientai"
        className="admin-back-link"
      >
        ← Grįžti į klientus
      </Link>

      {query.invited === "1" && (
        <div className="admin-success">
          Kliento prieiga prie savitarnos sukurta.
          Pakvietimas išsiųstas kliento el. paštu.
        </div>
      )}

      {query.password_link_sent === "1" && (
        <div className="admin-success">
          Nauja slaptažodžio nustatymo nuoroda
          išsiųsta kliento el. paštu.
        </div>
      )}

      {query.email_updated === "1" && (
        <div className="admin-success">
          Kliento el. paštas sėkmingai pakeistas.
          Prisijungimo paskyra ir kliento kortelė
          atnaujintos.
        </div>
      )}

      <div className="admin-detail-heading">
        <div>
          <span className="section-label">
            KLIENTO KORTELĖ
          </span>

          <h1>{client.name}</h1>

          <p>
            {clientTypeLabel(client.client_type)}
          </p>
        </div>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Pagrindiniai duomenys</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Kliento tipas</dt>
              <dd>
                {clientTypeLabel(client.client_type)}
              </dd>
            </div>

            <div>
              <dt>
                {client.client_type === "company"
                  ? "Įmonės pavadinimas"
                  : "Vardas ir pavardė"}
              </dt>

              <dd>{client.name}</dd>
            </div>

            {client.client_type === "company" && (
              <>
                <div>
                  <dt>Įmonės kodas</dt>
                  <dd>
                    {client.company_code || "—"}
                  </dd>
                </div>

                <div>
                  <dt>PVM mokėtojo kodas</dt>
                  <dd>{client.vat_code || "—"}</dd>
                </div>

                <div>
                  <dt>Kontaktinis asmuo</dt>
                  <dd>
                    {client.contact_name || "—"}
                  </dd>
                </div>
              </>
            )}

            <div>
              <dt>Adresas</dt>
              <dd>{client.address || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-detail-card">
          <h2>Kontaktai</h2>

          <dl className="admin-data-list">
            <div>
              <dt>El. paštas</dt>

              <dd>
                {client.email ? (
                  <a href={`mailto:${client.email}`}>
                    {client.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Telefonas</dt>

              <dd>
                {client.phone ? (
                  <a href={`tel:${client.phone}`}>
                    {client.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Klientas sukurtas</dt>
              <dd>
                {formatDate(client.created_at)}
              </dd>
            </div>

            <div>
              <dt>Paskutinį kartą atnaujinta</dt>
              <dd>
                {formatDate(client.updated_at)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="admin-detail-card admin-detail-section">
        <h2>Prieiga prie savitarnos</h2>

        {hasPortalAccess ? (
          <>
            <p>
              Šiam klientui prieiga prie savitarnos
              jau sukurta.
            </p>

            <dl className="admin-data-list">
              <div>
                <dt>Būsena</dt>
                <dd>Prieiga sukurta</dd>
              </div>

              <div>
                <dt>Naudotojų skaičius</dt>
                <dd>{memberships.length}</dd>
              </div>

              <div>
                <dt>Prieiga sukurta</dt>
                <dd>
                  {formatDate(
                    memberships[0]?.created_at ??
                      null
                  )}
                </dd>
              </div>
            </dl>

            <div
              style={{
                marginTop: "28px",
                paddingTop: "24px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <h3>Prisijungimo el. paštas</h3>

              <p className="admin-muted">
                Pakeitus adresą, bus atnaujintas
                kliento prisijungimo el. paštas ir
                el. paštas kliento kortelėje.
              </p>

              <form
                action={updatePortalEmail}
                className="offer-form"
              >
                <input
                  type="hidden"
                  name="clientId"
                  value={client.id}
                />

                <div className="offer-field">
                  <label htmlFor="portalEmail">
                    El. paštas
                  </label>

                  <input
                    id="portalEmail"
                    name="email"
                    type="email"
                    defaultValue={client.email ?? ""}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="admin-page-actions">
                  <button
                    type="submit"
                    className="button button-primary"
                  >
                    Pakeisti el. paštą
                  </button>
                </div>
              </form>
            </div>

            {client.email && (
              <div
                style={{
                  marginTop: "28px",
                  paddingTop: "24px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <h3>Slaptažodžio nustatymas</h3>

                <p className="admin-muted">
                  Jei klientas negavo ankstesnio
                  laiško, nuoroda nebegalioja arba
                  reikia nustatyti naują slaptažodį,
                  galima išsiųsti naują slaptažodžio
                  nustatymo nuorodą.
                </p>

                <div className="admin-page-actions">
                  <form
                    action={resendPortalPasswordLink}
                  >
                    <input
                      type="hidden"
                      name="clientId"
                      value={client.id}
                    />

                    <button
                      type="submit"
                      className="button button-primary"
                    >
                      Siųsti naują slaptažodžio
                      nustatymo nuorodą
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : !client.email ? (
          <p className="admin-muted">
            Prieigos sukurti negalima, nes kliento
            kortelėje nėra el. pašto adreso.
          </p>
        ) : (
          <>
            <p>
              Klientui bus sukurta prisijungimo
              paskyra ir jo el. paštu išsiųstas
              pakvietimas į MB „Arvigita“ klientų
              savitarną.
            </p>

            <p className="admin-muted">
              Klientas pats nustatys savo slaptažodį.
              Administratorius kliento slaptažodžio
              nematys ir nekurs.
            </p>

            <div className="admin-page-actions">
              <form action={createPortalAccess}>
                <input
                  type="hidden"
                  name="clientId"
                  value={client.id}
                />

                <button
                  type="submit"
                  className="button button-primary"
                >
                  Sukurti prieigą prie savitarnos
                </button>
              </form>
            </div>
          </>
        )}
      </section>

      <section className="admin-detail-card admin-detail-section">
        <h2>Projektai ir objektai</h2>

        {!projectLinks?.length ? (
          <p className="admin-muted">
            Šiam klientui projektų dar nepriskirta.
          </p>
        ) : (
          <div className="admin-selected-services">
            {projectLinks.map((item) => {
              const project = Array.isArray(
                item.projects
              )
                ? item.projects[0]
                : item.projects;

              if (!project) return null;

              return (
                <article
                  key={item.project_id}
                  className="admin-selected-service"
                >
                  <strong>{project.name}</strong>

                  <p>
                    {project.object_address ||
                      "Objekto adresas nenurodytas"}
                  </p>

                  <Link
                    href={`/administravimas/projektai/${project.id}`}
                    className="admin-open-link"
                  >
                    Atidaryti projektą →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-detail-card admin-detail-section">
        <h2>Kliento moduliai</h2>

        <div className="portal-grid">
          <div className="portal-card">
            <span>01</span>
            <h3>Projektai ir objektai</h3>
            <p>
              Klientui priklausantys statybos objektai
              ir projektai.
            </p>
          </div>

          <div className="portal-card">
            <span>02</span>
            <h3>Dokumentai</h3>
            <p>
              Sutartys, pasiūlymai, sąmatos, sąskaitos
              ir kiti dokumentai.
            </p>
          </div>

          <div className="portal-card">
            <span>03</span>
            <h3>Darbų eiga</h3>
            <p>
              Darbų progresas, terminai ir atliktų
              darbų informacija.
            </p>
          </div>

          <div className="portal-card">
            <span>04</span>
            <h3>Mokėjimai</h3>
            <p>
              Sąmatos, sąskaitos ir mokėjimų
              informacija.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}