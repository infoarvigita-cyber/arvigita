import { createClient } from "../../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

function categoryLabel(category: string | null) {
  const labels: Record<string, string> = {
    edz: "Elektroninis statybos darbų žurnalas",
    business_administration: "Verslo administravimas",
    construction_repair: "Statybos ir remonto paslaugos",
  };

  if (!category) return "—";

  return labels[category] ?? category;
}

export default async function PaslaugosPage() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="container admin-content">
      <div className="admin-page-heading">
        <span className="section-label">
          ADMINISTRAVIMAS
        </span>

        <h1>Paslaugos</h1>

        <p>
          MB „Arvigita“ paslaugų katalogas, naudojamas
          užklausose, pasiūlymuose ir projektuose.
        </p>
      </div>

      {error ? (
        <div className="admin-error">
          Paslaugų nepavyko įkelti.
        </div>
      ) : !services?.length ? (
        <div className="admin-empty">
          <h2>Paslaugų nėra</h2>
        </div>
      ) : (
        <div className="admin-service-grid">
          {services.map((service) => (
            <article
              className="admin-service-card"
              key={service.id}
            >
              <div className="admin-service-meta">
                <span>
                  {categoryLabel(service.category)}
                </span>

                <span
                  className={
                    service.is_active
                      ? "admin-active"
                      : "admin-inactive"
                  }
                >
                  {service.is_active
                    ? "Aktyvi"
                    : "Neaktyvi"}
                </span>
              </div>

              <h2>{service.name}</h2>

              <p>
                {service.description ||
                  "Aprašymas nepateiktas."}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}