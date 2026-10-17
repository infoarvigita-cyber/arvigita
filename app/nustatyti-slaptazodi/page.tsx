import Link from "next/link";
import { createClient } from "../uzklausa/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NustatytiSlaptazodiPage() {
  const supabase = await createClient();

  const {
    data: claimsData,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  return (
    <main className="container admin-content">
      <div
        className="admin-detail-card"
        style={{
          maxWidth: "560px",
          margin: "48px auto",
        }}
      >
        <span className="section-label">
          KLIENTŲ SAVITARNA
        </span>

        <h1>Nustatyti slaptažodį</h1>

        {!userId ? (
          <>
            <p>
              Pakvietimo nuoroda negalioja arba
              prisijungimo sesija nebuvo sukurta.
            </p>

            <p>
              Atidarykite nuorodą, kurią gavote
              pakvietimo el. laiške.
            </p>

            <div className="admin-page-actions">
              <Link
                href="/prisijungti"
                className="button admin-secondary-button"
              >
                Eiti į prisijungimą
              </Link>
            </div>
          </>
        ) : (
          <>
            <p>
              Sukurkite slaptažodį, kurį naudosite
              jungdamiesi prie MB „Arvigita“ klientų
              savitarnos.
            </p>

            <form
              action="/api/nustatyti-slaptazodi"
              method="post"
              className="offer-form"
            >
              <div className="offer-field">
                <label htmlFor="password">
                  Naujas slaptažodis
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  required
                />
              </div>

              <div className="offer-field">
                <label htmlFor="passwordConfirm">
                  Pakartokite slaptažodį
                </label>

                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  required
                />
              </div>

              <button
                type="submit"
                className="button button-primary"
              >
                Išsaugoti slaptažodį
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}