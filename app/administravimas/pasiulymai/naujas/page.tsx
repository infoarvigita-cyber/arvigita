import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../uzklausa/lib/supabase/server";
import OfferForm from "./OfferForm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    inquiryId?: string;
    clientId?: string;
  }>;
};

export default async function NaujasPasiulymasPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const inquiryId = params.inquiryId;
  const clientId = params.clientId;

  if (!inquiryId || !clientId) {
    notFound();
  }

  const supabase = await createClient();

  const { data: inquiry, error: inquiryError } =
    await supabase
      .from("inquiries")
      .select(`
        id,
        client_type,
        contact_name,
        company_name,
        email,
        object_location
      `)
      .eq("id", inquiryId)
      .single();

  const { data: client, error: clientError } =
    await supabase
      .from("clients")
      .select(`
        id,
        client_type,
        name,
        contact_name,
        company_code,
        vat_code,
        email,
        phone
      `)
      .eq("id", clientId)
      .single();

  if (
    inquiryError ||
    clientError ||
    !inquiry ||
    !client
  ) {
    notFound();
  }

  const { data: inquiryServices } =
    await supabase
      .from("inquiry_services")
      .select(`
        service_id,
        services (
          id,
          name,
          description
        )
      `)
      .eq("inquiry_id", inquiryId);

  const initialItems =
    inquiryServices
      ?.map((item) => {
        const service = Array.isArray(item.services)
          ? item.services[0]
          : item.services;

        if (!service) return null;

        return {
          serviceId: service.id,
          description: service.name,
        };
      })
      .filter(
        (
          item
        ): item is {
          serviceId: string;
          description: string;
        } => item !== null
      ) ?? [];

  const defaultTitle =
    inquiry.object_location
      ? `Pasiūlymas – ${inquiry.object_location}`
      : "Paslaugų pasiūlymas";

  return (
    <main className="container admin-content">
      <Link
        href={`/administravimas/uzklausos/${inquiryId}`}
        className="admin-back-link"
      >
        ← Grįžti į užklausą
      </Link>

      <div className="admin-page-heading">
        <span className="section-label">
          NAUJAS PASIŪLYMAS
        </span>

        <h1>Kurti pasiūlymą</h1>

        <p>
          Paruoškite pasiūlymą klientui. Pirmiausia
          jis bus išsaugotas kaip juodraštis.
        </p>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Klientas</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Klientas</dt>
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
                  <dt>PVM kodas</dt>
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
              <dt>El. paštas</dt>
              <dd>{client.email || "—"}</dd>
            </div>

            <div>
              <dt>Telefonas</dt>
              <dd>{client.phone || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-detail-card">
          <h2>Užklausa</h2>

          <dl className="admin-data-list">
            <div>
              <dt>Kontaktas</dt>
              <dd>{inquiry.contact_name}</dd>
            </div>

            <div>
              <dt>Objektas</dt>
              <dd>
                {inquiry.object_location || "—"}
              </dd>
            </div>

            <div>
              <dt>El. paštas</dt>
              <dd>{inquiry.email}</dd>
            </div>
          </dl>
        </section>
      </div>

      <OfferForm
        inquiryId={inquiryId}
        clientId={clientId}
        defaultTitle={defaultTitle}
        initialItems={initialItems}
      />
    </main>
  );
}