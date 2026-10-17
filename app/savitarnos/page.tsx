import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "../uzklausa/lib/supabase/server";

type ClientMembershipRow = {
  client_id: string;
  membership_role: string | null;
  clients:
    | {
        id: string;
        name: string;
        client_type: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        company_code: string | null;
        vat_code: string | null;
        contact_name: string | null;
      }
    | {
        id: string;
        name: string;
        client_type: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        company_code: string | null;
        vat_code: string | null;
        contact_name: string | null;
      }[]
    | null;
};

type ProjectRow = {
  id: string;
  name: string;
  status: string | null;
  object_address: string | null;
  start_date: string | null;
  planned_end_date: string | null;
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

export default async function ClientPortalPage() {
  const supabase = await createClient();

  /*
    1. Patikriname prisijungusį naudotoją.
  */
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  /*
    2. Gauname naudotojo profilį.
  */
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      system_role
    `)
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Nepavyko gauti profilio: ${profileError.message}`
    );
  }

  if (!profile) {
    throw new Error(
      "Naudotojo profilis nerastas."
    );
  }

  /*
    Administratoriaus paskyra nėra
    kliento savitarnos paskyra.
  */
  if (profile.system_role === "admin") {
    redirect("/administravimas");
  }

  /*
    3. Gauname tik prisijungusio naudotojo
       client_memberships.

    RLS papildomai turi užtikrinti,
    kad naudotojas negalėtų gauti
    svetimų narystės įrašų.
  */
  const {
    data: membershipsData,
    error: membershipsError,
  } = await supabase
    .from("client_memberships")
    .select(`
      client_id,
      membership_role,
      clients (
        id,
        name,
        client_type,
        email,
        phone,
        address,
        company_code,
        vat_code,
        contact_name
      )
    `)
    .eq("user_id", userId);

  if (membershipsError) {
    throw new Error(
      `Nepavyko gauti kliento duomenų: ${membershipsError.message}`
    );
  }

  const memberships =
    (membershipsData ??
      []) as ClientMembershipRow[];

  const clientIds = memberships
    .map((membership) => membership.client_id)
    .filter(Boolean);

  /*
    4. Gauname projektus.

    Sąmoningai nenaudojame administratoriaus
    ar service_role rakto.

    Užklausa vykdoma prisijungusio kliento
    sesijoje ir turi būti ribojama RLS.
  */
  let projects: ProjectRow[] = [];

  if (clientIds.length > 0) {
    const {
      data: projectLinks,
      error: projectLinksError,
    } = await supabase
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
      .in("client_id", clientIds);

    if (projectLinksError) {
      throw new Error(
        `Nepavyko gauti projektų: ${projectLinksError.message}`
      );
    }

    const uniqueProjects =
      new Map<string, ProjectRow>();

    for (const link of projectLinks ?? []) {
      const linkedProject =
        Array.isArray(link.projects)
          ? link.projects[0]
          : link.projects;

      if (!linkedProject) {
        continue;
      }

      uniqueProjects.set(
        linkedProject.id,
        linkedProject as ProjectRow
      );
    }

    projects = Array.from(
      uniqueProjects.values()
    );
  }

  const primaryMembership =
    memberships[0] ?? null;

  const primaryClient =
    primaryMembership
      ? Array.isArray(
          primaryMembership.clients
        )
        ? primaryMembership.clients[0]
        : primaryMembership.clients
      : null;

  return (
    <main className="portal-page">
      <div className="portal-shell">
        <div className="portal-topbar">
          <div>
            <p className="portal-eyebrow">
              MB „Arvigita“
            </p>

            <h1>Kliento savitarna</h1>

            <p>
              {profile.full_name
                ? `Sveiki, ${profile.full_name}`
                : "Sveiki"}
            </p>
          </div>

          <Link
            href="/atsijungti"
            className="portal-button portal-button-secondary"
          >
            Atsijungti
          </Link>
        </div>

        {memberships.length === 0 ? (
          <section className="portal-section">
            <div className="portal-empty">
              <h2>
                Kliento paskyra dar
                nesusieta
              </h2>

              <p>
                Jūsų prisijungimas sukurtas,
                tačiau šiuo metu prie paskyros
                dar nepriskirti kliento
                duomenys.
              </p>

              <p>
                Susisiekite su MB „Arvigita“,
                jei manote, kad čia turėtų būti
                rodomas jūsų projektas.
              </p>
            </div>
          </section>
        ) : (
          <>
            {primaryClient && (
              <section className="portal-section">
                <div className="portal-section-heading">
                  <div>
                    <p className="portal-eyebrow">
                      Mano duomenys
                    </p>

                    <h2>
                      {primaryClient.name}
                    </h2>
                  </div>
                </div>

                <div className="portal-list">
                  {primaryClient.client_type ===
                    "company" && (
                    <>
                      <div className="portal-list-item">
                        <div>
                          <strong>
                            Įmonės kodas
                          </strong>

                          <p>
                            {primaryClient.company_code ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <div className="portal-list-item">
                        <div>
                          <strong>
                            PVM kodas
                          </strong>

                          <p>
                            {primaryClient.vat_code ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="portal-list-item">
                    <div>
                      <strong>
                        Kontaktinis asmuo
                      </strong>

                      <p>
                        {primaryClient.contact_name ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="portal-list-item">
                    <div>
                      <strong>
                        El. paštas
                      </strong>

                      <p>
                        {primaryClient.email ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="portal-list-item">
                    <div>
                      <strong>
                        Telefonas
                      </strong>

                      <p>
                        {primaryClient.phone ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="portal-list-item">
                    <div>
                      <strong>
                        Adresas
                      </strong>

                      <p>
                        {primaryClient.address ||
                          "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="portal-section">
              <div className="portal-section-heading">
                <div>
                  <p className="portal-eyebrow">
                    Mano projektai
                  </p>

                  <h2>Projektai</h2>
                </div>

                <span>{projects.length}</span>
              </div>

              {projects.length === 0 ? (
                <div className="portal-empty">
                  <h3>
                    Projektų šiuo metu nėra
                  </h3>

                  <p>
                    Kai MB „Arvigita“ prie
                    jūsų paskyros priskirs
                    projektą, jis bus rodomas
                    čia.
                  </p>
                </div>
              ) : (
                <div className="portal-grid">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/savitarnos/projektai/${project.id}`}
                      className="portal-card"
                    >
                      <span>
                        {projectStatusLabel(
                          project.status
                        )}
                      </span>

                      <h3>{project.name}</h3>

                      <p>
                        {project.object_address ||
                          "Objekto adresas nenurodytas"}
                      </p>

                      {project.start_date && (
                        <p>
                          Pradžia:{" "}
                          {new Intl.DateTimeFormat(
                            "lt-LT"
                          ).format(
                            new Date(
                              project.start_date
                            )
                          )}
                        </p>
                      )}

                      {project.planned_end_date && (
                        <p>
                          Planuojama pabaiga:{" "}
                          {new Intl.DateTimeFormat(
                            "lt-LT"
                          ).format(
                            new Date(
                              project.planned_end_date
                            )
                          )}
                        </p>
                      )}

                      <strong>
                        Atidaryti projektą →
                      </strong>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="portal-section">
              <div className="portal-section-heading">
                <div>
                  <p className="portal-eyebrow">
                    Savitarna
                  </p>

                  <h2>
                    Ką rasite savo projektuose
                  </h2>
                </div>
              </div>

              <div className="portal-grid">
                <div className="portal-card">
                  <span>01</span>

                  <h3>Dokumentai</h3>

                  <p>
                    Sutartys, sąmatos,
                    EDŽ dokumentai ir kita
                    jums skirta dokumentacija.
                  </p>
                </div>

                <div className="portal-card">
                  <span>02</span>

                  <h3>Darbų eiga</h3>

                  <p>
                    Projekto būsena,
                    darbų eiga ir terminai.
                  </p>
                </div>

                <div className="portal-card">
                  <span>03</span>

                  <h3>Nuotraukos</h3>

                  <p>
                    Projekto ir atliktų
                    darbų nuotraukos.
                  </p>
                </div>

                <div className="portal-card">
                  <span>04</span>

                  <h3>Finansai</h3>

                  <p>
                    Pasiūlymai, sąmatos,
                    sąskaitos ir mokėjimų
                    informacija.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}