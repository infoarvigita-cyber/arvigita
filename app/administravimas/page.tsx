import Link from "next/link";
import { createClient } from "../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdministravimasPage() {
  const supabase = await createClient();

  const [
    inquiriesResult,
    clientsResult,
    offersResult,
    projectsResult,
    servicesResult,
  ] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("clients")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("offers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("projects")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("services")
      .select("*", { count: "exact", head: true }),
  ]);

  const modules = [
    {
      number: "01",
      title: "Užklausos",
      description:
        "Naujų klientų užklausų peržiūra ir administravimas.",
      href: "/administravimas/uzklausos",
      count: inquiriesResult.count ?? 0,
    },
    {
      number: "02",
      title: "Klientai",
      description:
        "Fizinių ir juridinių klientų duomenų valdymas.",
      href: "/administravimas/klientai",
      count: clientsResult.count ?? 0,
    },
    {
      number: "03",
      title: "Pasiūlymai",
      description:
        "Komercinių pasiūlymų rengimas ir būsenų valdymas.",
      href: "/administravimas/pasiulymai",
      count: offersResult.count ?? 0,
    },
    {
      number: "04",
      title: "Projektai",
      description:
        "Objektų, projektų ir jiems priskirtų paslaugų valdymas.",
      href: "/administravimas/projektai",
      count: projectsResult.count ?? 0,
    },
    {
      number: "05",
      title: "Paslaugos",
      description:
        "MB „Arvigita“ teikiamų paslaugų katalogas.",
      href: "/administravimas/paslaugos",
      count: servicesResult.count ?? 0,
    },
  ];

  return (
    <main className="container admin-content">
      <div className="admin-page-heading">
        <span className="section-label">ADMINISTRAVIMAS</span>

        <h1>Valdymo skydas</h1>

        <p>
          Klientų, užklausų, pasiūlymų, projektų ir paslaugų
          administravimo aplinka.
        </p>
      </div>

      <div className="admin-dashboard-grid">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="admin-dashboard-card"
          >
            <div className="admin-card-top">
              <span>{module.number}</span>

              <strong className="admin-count">
                {module.count}
              </strong>
            </div>

            <h2>{module.title}</h2>

            <p>{module.description}</p>

            <div className="admin-card-action">
              Atidaryti →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}