import Link from "next/link";

import { createClient } from "../../../uzklausa/lib/supabase/server";
import { createProject } from "./actions";

export const dynamic = "force-dynamic";

function clientTypeLabel(type: string) {
  if (type === "individual") return "Fizinis asmuo";
  if (type === "company") return "Juridinis asmuo";

  return type;
}

function serviceCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    edz: "Elektroninis statybos darbų žurnalas",
    business_administration: "Verslo administravimas",
    construction_repair: "Statybos ir remonto paslaugos",
  };

  return labels[category] ?? category;
}

export default async function NaujasProjektasPage() {
  const supabase = await createClient();

  const { data: clients, error: clientsError } =
    await supabase
      .from("clients")
      .select(`
        id,
        client_type,
        name,
        contact_name,
        company_code,
        email
      `)
      .order("name", {
        ascending: true,
      });

  const { data: services, error: servicesError } =
    await supabase
      .from("services")
      .select(`
        id,
        name,
        category,
        description,
        sort_order
      `)
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      });

  const hasLoadError =
    Boolean(clientsError) ||
    Boolean(servicesError);

  return (
    <main className="container admin-content">
      <Link
        href="/administravimas/projektai"
        className="admin-back-link"
      >
        ← Grįžti į projektus
      </Link>

      <div className="admin-page-heading">
        <span className="section-label">
          ADMINISTRAVIMAS
        </span>

        <h1>Naujas projektas</h1>

        <p>
          Sukurkite statybos objektą ar darbų projektą,
          priskirkite klientą ir projekto paslaugas.
        </p>
      </div>

      {hasLoadError ? (
        <div className="admin-error">
          Nepavyko įkelti klientų arba paslaugų.
          Projekto kūrimas laikinai negalimas.
        </div>
      ) : !clients?.length ? (
        <div className="admin-empty">
          <h2>Nėra klientų</h2>

          <p>
            Prieš kuriant projektą pirmiausia turi būti
            sukurtas klientas.
          </p>

          <Link
            href="/administravimas/klientai"
            className="button button-primary"
          >
            Atidaryti klientus
          </Link>
        </div>
      ) : (
        <form action={createProject}>
          <section className="admin-detail-card admin-detail-section">
            <h2>Pagrindinė informacija</h2>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">
                  Projekto pavadinimas *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Pvz. Gyvenamojo namo statyba"
                />
              </div>

              <div className="form-field">
                <label htmlFor="client_id">
                  Klientas *
                </label>

                <select
                  id="client_id"
                  name="client_id"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Pasirinkite klientą
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                      {" — "}
                      {clientTypeLabel(
                        client.client_type
                      )}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="object_address">
                  Objekto adresas
                </label>

                <input
                  id="object_address"
                  name="object_address"
                  type="text"
                  placeholder="Pvz. Testų g. 1, Klaipėda"
                />
              </div>
            </div>
          </section>

          <section className="admin-detail-card admin-detail-section">
            <h2>Būsena ir terminai</h2>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="status">
                  Projekto būsena *
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="planned"
                  required
                >
                  <option value="planned">
                    Planuojamas
                  </option>

                  <option value="active">
                    Vykdomas
                  </option>

                  <option value="completed">
                    Užbaigtas
                  </option>

                  <option value="cancelled">
                    Atšauktas
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="start_date">
                  Darbų pradžia
                </label>

                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                />
              </div>

              <div className="form-field">
                <label htmlFor="planned_end_date">
                  Planuojama pabaiga
                </label>

                <input
                  id="planned_end_date"
                  name="planned_end_date"
                  type="date"
                />
              </div>
            </div>
          </section>

          <section className="admin-detail-card admin-detail-section">
            <h2>Paslaugos</h2>

            {!services?.length ? (
              <p className="admin-muted">
                Aktyvių paslaugų šiuo metu nėra.
                Projektą galima sukurti ir be
                priskirtų paslaugų.
              </p>
            ) : (
              <div className="admin-selected-services">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="admin-selected-service"
                  >
                    <div>
                      <input
                        type="checkbox"
                        name="service_ids"
                        value={service.id}
                      />

                      <strong>
                        {" "}
                        {service.name}
                      </strong>
                    </div>

                    <p>
                      {serviceCategoryLabel(
                        service.category
                      )}
                    </p>

                    {service.description && (
                      <p className="admin-muted">
                        {service.description}
                      </p>
                    )}
                  </label>
                ))}
              </div>
            )}
          </section>

          <div className="admin-page-actions">
            <Link
              href="/administravimas/projektai"
              className="button button-secondary"
            >
              Atšaukti
            </Link>

            <button
              type="submit"
              className="button button-primary"
            >
              Sukurti projektą
            </button>
          </div>
        </form>
      )}
    </main>
  );
}