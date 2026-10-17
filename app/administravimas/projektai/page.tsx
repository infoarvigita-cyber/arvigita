import Link from "next/link";

import { createClient } from "../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

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

export default async function ProjektaiPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="container admin-content">
      <div className="admin-page-heading admin-heading-row">
        <div>
          <span className="section-label">
            ADMINISTRAVIMAS
          </span>

          <h1>Projektai</h1>

          <p>
            Statybos objektai, darbų projektai ir jų
            būsenos.
          </p>
        </div>

        <Link
          href="/administravimas/projektai/naujas"
          className="button button-primary"
        >
          + Naujas projektas
        </Link>
      </div>

      {error ? (
        <div className="admin-error">
          Projektų nepavyko įkelti.
        </div>
      ) : !projects?.length ? (
        <div className="admin-empty">
          <h2>Projektų dar nėra</h2>

          <p>
            Sukurti projektai bus rodomi šiame
            sąraše.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Projektas</th>
                <th>Objektas</th>
                <th>Būsena</th>
                <th>Pradžia</th>
                <th>Planuojama pabaiga</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>
                      {project.name ?? "—"}
                    </strong>
                  </td>

                  <td>
                    {project.object_address ?? "—"}
                  </td>

                  <td>
                    {statusLabel(project.status)}
                  </td>

                  <td>
                    {formatDate(project.start_date)}
                  </td>

                  <td>
                    {formatDate(
                      project.planned_end_date
                    )}
                  </td>

                  <td>
                    <Link
                      href={`/administravimas/projektai/${project.id}`}
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