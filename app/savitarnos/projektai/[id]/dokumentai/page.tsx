import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";
import { openClientDocument } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDocumentsPage({
  params,
}: PageProps) {
  const { id: projectId } = await params;

  const supabase = await createClient();

  // Prisijungimo patikra
  const {
    data: claimsData,
    error: authError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (authError || !userId) {
    redirect("/prisijungti");
  }

  /*
    Projekto užklausa eina per RLS.
    Svetimo kliento projektas neturi
    būti grąžintas.
  */
  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      object_address
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

  // Dokumentų tipai naudojami tik pavadinimams
  const {
    data: documentTypes,
    error: documentTypesError,
  } = await supabase
    .from("document_types")
    .select(`
      code,
      name
    `)
    .eq("is_active", true);

  if (documentTypesError) {
    throw new Error(
      `Nepavyko gauti dokumentų tipų: ${documentTypesError.message}`
    );
  }

  /*
    Labai svarbu:
    klientui prašome tik visibility = client.

    Be to, public.documents RLS turi
    papildomai užtikrinti, kad dokumentas
    priklauso jo klientui.
  */
  const {
    data: documents,
    error: documentsError,
  } = await supabase
    .from("documents")
    .select(`
      id,
      project_id,
      original_filename,
      document_type,
      visibility,
      created_at
    `)
    .eq("project_id", projectId)
    .eq("visibility", "client")
    .order("created_at", {
      ascending: false,
    });

  if (documentsError) {
    throw new Error(
      `Nepavyko gauti dokumentų: ${documentsError.message}`
    );
  }

  const documentTypeNames = new Map(
    (documentTypes ?? []).map(
      (documentType) => [
        documentType.code,
        documentType.name,
      ]
    )
  );

  return (
    <main className="portal-page">
      <div className="portal-shell">
        <div className="portal-topbar">
          <div>
            <p className="portal-eyebrow">
              Kliento savitarna
            </p>

            <h1>Dokumentai</h1>

            <p>
              {project.name}
              {project.object_address
                ? ` · ${project.object_address}`
                : ""}
            </p>
          </div>

          <Link
            href={`/savitarnos/projektai/${project.id}`}
            className="portal-button portal-button-secondary"
          >
            ← Grįžti į projektą
          </Link>
        </div>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Projekto dokumentai
              </p>

              <h2>Jums skirti dokumentai</h2>
            </div>

            <span>
              {documents?.length ?? 0}
            </span>
          </div>

          {!documents ||
          documents.length === 0 ? (
            <div className="portal-empty">
              <h3>
                Dokumentų šiuo metu nėra
              </h3>

              <p>
                Kai administratorius paskelbs
                jums skirtą dokumentą, jis
                atsiras šiame sąraše.
              </p>
            </div>
          ) : (
            <div className="portal-list">
              {documents.map((document) => (
                <article
                  key={document.id}
                  className="portal-list-item"
                >
                  <div>
                    <strong>
                      {document.original_filename}
                    </strong>

                    <p>
                      Tipas:{" "}
                      {documentTypeNames.get(
                        document.document_type
                      ) ??
                        document.document_type ??
                        "—"}
                    </p>

                    <p>
                      Įkelta:{" "}
                      {new Intl.DateTimeFormat(
                        "lt-LT",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      ).format(
                        new Date(
                          document.created_at
                        )
                      )}
                    </p>
                  </div>

                  <form
                    action={openClientDocument}
                  >
                    <input
                      type="hidden"
                      name="document_id"
                      value={document.id}
                    />

                    <input
                      type="hidden"
                      name="project_id"
                      value={project.id}
                    />

                    <button
                      type="submit"
                      className="portal-button portal-button-secondary"
                    >
                      Atidaryti
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portal-section">
          <div className="portal-empty">
            <h3>Dokumentų valdymas</h3>

            <p>
              Dokumentus įkelia ir administruoja
              MB „Arvigita“. Kliento savitarnoje
              dokumentus galima tik peržiūrėti.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}