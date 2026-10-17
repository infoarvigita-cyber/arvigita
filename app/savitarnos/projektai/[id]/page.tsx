import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../uzklausa/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProjectServiceRow = {
  service_id: string;
  services:
    | {
        id: string;
        name: string;
        category: string | null;
      }
    | {
        id: string;
        name: string;
        category: string | null;
      }[]
    | null;
};

function projectStatusLabel(
  status: string | null
) {
  switch (status) {
    case "planned":
      return "Planuojamas";

    case "active":
      return "Vykdomas";

    case "completed":
      return "Užbaigtas";

    case "cancelled":
      return "Atšauktas";

    default:
      return status || "—";
  }
}

export default async function ClientProjectPage({
  params,
}: PageProps) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  // Prisijungusio naudotojo patikra
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  /*
    Projektas gaunamas per prisijungusio
    kliento Supabase sesiją.

    RLS turi užtikrinti, kad klientas
    negalėtų gauti svetimo projekto.
  */
  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      object_address,
      start_date,
      planned_end_date,
      created_at
    `)
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    throw new Error(
      `Nepavyko gauti projekto: ${projectError.message}`
    );
  }

  if (!project) {
    notFound();
  }

  /*
    Projekto paslaugos.

    Ši užklausa taip pat turi veikti
    pagal esamas RLS taisykles.
  */
  const {
    data: projectServicesData,
    error: servicesError,
  } = await supabase
    .from("project_services")
    .select(`
      service_id,
      services (
        id,
        name,
        category
      )
    `)
    .eq("project_id", project.id);

  if (servicesError) {
    throw new Error(
      `Nepavyko gauti projekto paslaugų: ${servicesError.message}`
    );
  }

  const projectServices =
    (projectServicesData ??
      []) as ProjectServiceRow[];

  return (
    <main className="portal-page">
      <div className="portal-shell">
        <div className="portal-topbar">
          <div>
            <p className="portal-eyebrow">
              Kliento savitarna
            </p>

            <h1>{project.name}</h1>

            <p>
              {project.object_address ||
                "Objekto adresas nenurodytas"}
            </p>
          </div>

          <Link
            href="/savitarnos"
            className="portal-button portal-button-secondary"
          >
            ← Grįžti į savitarną
          </Link>
        </div>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Projektas
              </p>

              <h2>Projekto informacija</h2>
            </div>
          </div>

          <div className="portal-list">
            <div className="portal-list-item">
              <div>
                <strong>Būsena</strong>

                <p>
                  {projectStatusLabel(
                    project.status
                  )}
                </p>
              </div>
            </div>

            <div className="portal-list-item">
              <div>
                <strong>
                  Objekto adresas
                </strong>

                <p>
                  {project.object_address ||
                    "—"}
                </p>
              </div>
            </div>

            <div className="portal-list-item">
              <div>
                <strong>
                  Darbų pradžia
                </strong>

                <p>
                  {project.start_date
                    ? new Intl.DateTimeFormat(
                        "lt-LT"
                      ).format(
                        new Date(
                          project.start_date
                        )
                      )
                    : "—"}
                </p>
              </div>
            </div>

            <div className="portal-list-item">
              <div>
                <strong>
                  Planuojama pabaiga
                </strong>

                <p>
                  {project.planned_end_date
                    ? new Intl.DateTimeFormat(
                        "lt-LT"
                      ).format(
                        new Date(
                          project.planned_end_date
                        )
                      )
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Paslaugos
              </p>

              <h2>Projekto paslaugos</h2>
            </div>
          </div>

          {projectServices.length === 0 ? (
            <div className="portal-empty">
              <p>
                Projektui paslaugos dar
                nepriskirtos.
              </p>
            </div>
          ) : (
            <div className="portal-list">
              {projectServices.map(
                (projectService) => {
                  const service =
                    Array.isArray(
                      projectService.services
                    )
                      ? projectService
                          .services[0]
                      : projectService.services;

                  if (!service) {
                    return null;
                  }

                  return (
                    <div
                      key={
                        projectService.service_id
                      }
                      className="portal-list-item"
                    >
                      <div>
                        <strong>
                          {service.name}
                        </strong>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Projekto moduliai
              </p>

              <h2>Informacija</h2>
            </div>
          </div>

          <div className="portal-grid">
            <Link
              href={`/savitarnos/projektai/${project.id}/dokumentai`}
              className="portal-card"
            >
              <span>01</span>

              <h3>Dokumentai</h3>

              <p>
                Jums skirti projekto
                dokumentai.
              </p>

              <strong>
                Atidaryti →
              </strong>
            </Link>

            <div className="portal-card">
              <span>02</span>

              <h3>Darbų eiga</h3>

              <p>
                Projekto eiga, darbų
                būsenos ir terminai.
              </p>
            </div>

            <div className="portal-card">
              <span>03</span>

              <h3>Nuotraukos</h3>

              <p>
                Atliktų darbų ir projekto
                eigos nuotraukos.
              </p>
            </div>

            <div className="portal-card">
              <span>04</span>

              <h3>Finansai</h3>

              <p>
                Pasiūlymai, sąmatos,
                sąskaitos ir mokėjimai.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}