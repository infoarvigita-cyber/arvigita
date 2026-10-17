import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../../../uzklausa/lib/supabase/server";
import {
  openProjectDocument,
  uploadProjectDocument,
} from "./actions";
import DeleteDocumentButton from "./DeleteDocumentButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    uploaded?: string;
    deleted?: string;
  }>;
};

export default async function ProjectDocumentsPage({
  params,
  searchParams,
}: PageProps) {
  const { id: projectId } = await params;
  const { uploaded, deleted } = await searchParams;

  const supabase = await createClient();

  // Projekto duomenys
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
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Projekto klientas
  const {
    data: projectClient,
    error: projectClientError,
  } = await supabase
    .from("project_clients")
    .select("client_id")
    .eq("project_id", projectId)
    .limit(1)
    .maybeSingle();

  if (
    projectClientError ||
    !projectClient?.client_id
  ) {
    throw new Error(
      "Projektui nepriskirtas klientas."
    );
  }

  // Aktyvūs dokumentų tipai
  const {
    data: documentTypes,
    error: documentTypesError,
  } = await supabase
    .from("document_types")
    .select(`
      id,
      code,
      name
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (documentTypesError) {
    throw new Error(
      `Nepavyko gauti dokumentų tipų: ${documentTypesError.message}`
    );
  }

  // Projekto dokumentai
  const {
    data: documents,
    error: documentsError,
  } = await supabase
    .from("documents")
    .select(`
      id,
      original_filename,
      visibility,
      created_at,
      document_type
    `)
    .eq("project_id", projectId)
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
              Administravimas
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
            href={`/administravimas/projektai/${project.id}`}
            className="portal-button portal-button-secondary"
          >
            ← Grįžti į projektą
          </Link>
        </div>

        {uploaded === "1" && (
          <div className="portal-success">
            Dokumentas sėkmingai įkeltas.
          </div>
        )}

        {deleted === "1" && (
          <div className="portal-success">
            Dokumentas sėkmingai ištrintas.
          </div>
        )}

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Naujas dokumentas
              </p>

              <h2>Įkelti dokumentą</h2>
            </div>
          </div>

          <form
            action={uploadProjectDocument}
            className="portal-form"
          >
            <input
              type="hidden"
              name="project_id"
              value={project.id}
            />

            <input
              type="hidden"
              name="client_id"
              value={projectClient.client_id}
            />

            <div className="portal-form-grid">
              <label className="portal-field">
                <span>Dokumento tipas</span>

                <select
                  name="document_type"
                  required
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Pasirinkite dokumento tipą
                  </option>

                  {(documentTypes ?? []).map(
                    (documentType) => (
                      <option
                        key={documentType.id}
                        value={documentType.code}
                      >
                        {documentType.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="portal-field">
                <span>Matomumas</span>

                <select
                  name="visibility"
                  defaultValue="admin"
                  required
                >
                  <option value="admin">
                    Tik administratoriui
                  </option>

                  <option value="client">
                    Matomas klientui
                  </option>
                </select>
              </label>
            </div>

            <label className="portal-field">
              <span>Failas</span>

              <input
                type="file"
                name="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                required
              />

              <small>
                Leidžiami PDF, JPG ir PNG failai.
                Maksimalus dydis – 20 MB.
              </small>
            </label>

            <div>
              <button
                type="submit"
                className="portal-button"
              >
                Įkelti dokumentą
              </button>
            </div>
          </form>
        </section>

        <section className="portal-section">
          <div className="portal-section-heading">
            <div>
              <p className="portal-eyebrow">
                Projekto dokumentai
              </p>

              <h2>Dokumentų sąrašas</h2>
            </div>

            <span>
              {documents?.length ?? 0}
            </span>
          </div>

          {!documents ||
          documents.length === 0 ? (
            <div className="portal-empty">
              <h3>Dokumentų dar nėra</h3>

              <p>
                Įkelti projekto dokumentai
                bus rodomi čia.
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
                      Matomumas:{" "}
                      {document.visibility ===
                      "client"
                        ? "Matomas klientui"
                        : "Tik administratoriui"}
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

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <form
                      action={openProjectDocument}
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

                    <DeleteDocumentButton
                      documentId={document.id}
                      projectId={project.id}
                      fileName={
                        document.original_filename
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}