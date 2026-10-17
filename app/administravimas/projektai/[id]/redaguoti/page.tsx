import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";
import { updateProject } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function categoryLabel(category: string | null) {
  const labels: Record<string, string> = {
    edz: "Elektroninis statybos darbų žurnalas",
    business_administration: "Verslo administravimas",
    construction_repair: "Statybos ir remonto paslaugos",
  };

  if (!category) {
    return "Kitos paslaugos";
  }

  return labels[category] ?? category;
}

export default async function RedaguotiProjektaPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Projekto duomenys
  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select(
      `
        id,
        name,
        status,
        object_address,
        start_date,
        planned_end_date
      `
    )
    .eq("id", id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Prie projekto priskirtas klientas
  const {
    data: projectClient,
  } = await supabase
    .from("project_clients")
    .select(
      `
        client_id,
        clients (
          id,
          client_type,
          name,
          contact_name,
          email
        )
      `
    )
    .eq("project_id", id)
    .limit(1)
    .maybeSingle();

  // Visos aktyvios paslaugos
  const {
    data: services,
    error: servicesError,
  } = await supabase
    .from("services")
    .select(
      `
        id,
        name,
        category,
        description,
        sort_order
      `
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (servicesError) {
    throw new Error(
      `Nepavyko įkelti paslaugų: ${servicesError.message}`
    );
  }

  // Jau projektui priskirtos paslaugos
  const {
    data: selectedServices,
    error: selectedServicesError,
  } = await supabase
    .from("project_services")
    .select("service_id")
    .eq("project_id", id);

  if (selectedServicesError) {
    throw new Error(
      `Nepavyko įkelti projekto paslaugų: ${selectedServicesError.message}`
    );
  }

  const selectedServiceIds = new Set(
    (selectedServices ?? []).map(
      (item) => item.service_id
    )
  );

  const clientData = Array.isArray(
    projectClient?.clients
  )
    ? projectClient?.clients[0]
    : projectClient?.clients;

  return (
    <main className="container admin-content">
      <div className="admin-page-heading">
        <span className="section-label">
          ADMINISTRAVIMAS
        </span>

        <h1>Redaguoti projektą</h1>

        <p>
          Keiskite projekto informaciją ir jam
          priskirtas paslaugas.
        </p>
      </div>

      <form action={updateProject}>
        <input
          type="hidden"
          name="projectId"
          value={project.id}
        />

        <div className="admin-card">
          <h2>Klientas</h2>

          <p>
            <strong>
              {clientData?.name ?? "—"}
            </strong>
          </p>

          {clientData?.contact_name ? (
            <p>
              Kontaktinis asmuo:{" "}
              {clientData.contact_name}
            </p>
          ) : null}

          {clientData?.email ? (
            <p>
              El. paštas: {clientData.email}
            </p>
          ) : null}

          <p>
            Klientas šiame redagavimo lange
            nekeičiamas.
          </p>
        </div>

        <div className="admin-card">
          <h2>Projekto duomenys</h2>

          <div className="form-group">
            <label htmlFor="name">
              Projekto pavadinimas *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={project.name ?? ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="object_address">
              Objekto adresas
            </label>

            <input
              id="object_address"
              name="object_address"
              type="text"
              defaultValue={
                project.object_address ?? ""
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              Projekto būsena *
            </label>

            <select
              id="status"
              name="status"
              required
              defaultValue={
                project.status ?? "planned"
              }
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

          <div className="form-group">
            <label htmlFor="start_date">
              Darbų pradžia
            </label>

            <input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={
                project.start_date ?? ""
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="planned_end_date">
              Planuojama darbų pabaiga
            </label>

            <input
              id="planned_end_date"
              name="planned_end_date"
              type="date"
              defaultValue={
                project.planned_end_date ?? ""
              }
            />
          </div>
        </div>

        <div className="admin-card">
          <h2>Paslaugos</h2>

          {!services?.length ? (
            <p>
              Aktyvių paslaugų nėra.
            </p>
          ) : (
            services.map((service) => (
              <label
                key={service.id}
                style={{
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="checkbox"
                  name="service_ids"
                  value={service.id}
                  defaultChecked={selectedServiceIds.has(
                    service.id
                  )}
                  style={{
                    marginRight: "10px",
                  }}
                />

                <strong>{service.name}</strong>

                <div
                  style={{
                    marginLeft: "26px",
                    marginTop: "4px",
                  }}
                >
                  <small>
                    {categoryLabel(
                      service.category
                    )}
                  </small>

                  {service.description ? (
                    <p>
                      {service.description}
                    </p>
                  ) : null}
                </div>
              </label>
            ))
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            type="submit"
            className="button button-primary"
          >
            Išsaugoti pakeitimus
          </button>

          <Link
            href={`/administravimas/projektai/${project.id}`}
            className="button"
          >
            Atšaukti
          </Link>
        </div>
      </form>
    </main>
  );
}