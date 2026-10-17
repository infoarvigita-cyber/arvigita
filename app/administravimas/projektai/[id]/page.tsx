import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    updated?: string;
    created?: string;
  }>;
};

function statusLabel(status: string | null) {
  const labels: Record<string, string> = {
    planned: "Planuojamas",
    active: "Vykdomas",
    completed: "Užbaigtas",
    cancelled: "Atšauktas",
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

export default async function ProjektasPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      object_address,
      start_date,
      planned_end_date,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: clientLinks } = await supabase
    .from("project_clients")
    .select(`
      client_id,
      clients (
        id,
        client_type,
        name,
        contact_name,
        email,
        phone
      )
    `)
    .eq("project_id", id);

  const { data: serviceLinks } = await supabase
    .from("project_services")
    .select(`
      service_id,
      services (
        id,
        name,
        category,
        description
      )
    `)
    .eq("project_id", id);

  return (
    <main className="container admin-content">
      <Link
        href="/administravimas/projektai"
        className="admin-back-link"
      >
        ← Grįžti į projektus
      </Link>

      {query.created === "1" && (
        <div className="admin-success">
          Projektas sėkmingai sukurtas.
        </div>
      )}

      {query.updated === "1" && (
        <div className="admin-success">
          Projekto duomenys sėkmingai atnaujinti.
        </div>
      )}

      <div className="admin-detail-heading">
        <div>
          <span className="section-label">
            PROJEKTO KORTELĖ
          </span>

          <h1>{project.name}</h1>

          <p>{statusLabel(project.status)}</p>
        </div>

        <Link
          href={`/administravimas/projektai/${project.id}/redaguoti`}
          className="button button-primary"
        >
          Redaguoti projektą
        </Link>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Objekto duomenys</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Projekto pavadinimas</dt>
              <dd>{project.name}</dd>
            </div>

            <div>
              <dt>Objekto adresas</dt>
              <dd>{project.object_address || "—"}</dd>
            </div>

            <div>
              <dt>Būsena</dt>
              <dd>{statusLabel(project.status)}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-detail-card">
          <h2>Terminai</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Darbų pradžia</dt>
              <dd>{formatDate(project.start_date)}</dd>
            </div>

            <div>
              <dt>Planuojama pabaiga</dt>
              <dd>
                {formatDate(project.planned_end_date)}
              </dd>
            </div>

            <div>
              <dt>Projektas sukurtas</dt>
              <dd>{formatDate(project.created_at)}</dd>
            </div>

            <div>
              <dt>Paskutinį kartą atnaujinta</dt>
              <dd>{formatDate(project.updated_at)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="admin-detail-card admin-detail-section">
        <h2>Klientai</h2>

        {!clientLinks?.length ? (
          <p className="admin-muted">
            Šiam projektui klientas dar nepriskirtas.
          </p>
        ) : (
          <div className="admin-selected-services">
            {clientLinks.map((item) => {
              const client = Array.isArray(item.clients)
                ? item.clients[0]
                : item.clients;

              if (!client) return null;

              return (
                <article
                  key={item.client_id}
                  className="admin-selected-service"
                >
                  <strong>{client.name}</strong>

                  <p>
                    {client.contact_name ||
                      client.email ||
                      "Kontaktiniai duomenys nenurodyti"}
                  </p>

                  <Link
                    href={`/administravimas/klientai/${client.id}`}
                    className="admin-open-link"
                  >
                    Atidaryti klientą →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-detail-card admin-detail-section">
        <h2>Paslaugos</h2>

        {!serviceLinks?.length ? (
          <p className="admin-muted">
            Šiam projektui paslaugos dar nepriskirtos.
          </p>
        ) : (
          <div className="admin-selected-services">
            {serviceLinks.map((item) => {
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
        <h2>Projekto moduliai</h2>

        <div className="portal-grid">
          <Link
            href={`/administravimas/projektai/${project.id}/dokumentai`}
            className="portal-card"
          >
            <span>01</span>
            <h3>Dokumentai</h3>
            <p>
              Sutartys, projektinė dokumentacija,
              deklaracijos ir kiti projekto dokumentai.
            </p>

            <strong>Atidaryti →</strong>
          </Link>

          <div className="portal-card">
            <span>02</span>
            <h3>Darbų eiga</h3>
            <p>
              Projekto darbų progresas, etapai ir
              terminai.
            </p>
          </div>

          <div className="portal-card">
            <span>03</span>
            <h3>Nuotraukos</h3>
            <p>
              Atliktų darbų ir objekto eigos
              nuotraukos.
            </p>
          </div>

          <div className="portal-card">
            <span>04</span>
            <h3>Finansai</h3>
            <p>
              Pasiūlymai, sąmatos, sąskaitos ir
              mokėjimai.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}