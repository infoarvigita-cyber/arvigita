"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../uzklausa/lib/supabase/client";

export default function PamirsoSlaptazodiPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const supabase = createClient();

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atnaujinti-slaptazodi`,
    });

    setIsSubmitting(false);

    // Sąmoningai neatskleidžiame, ar toks el. paštas egzistuoja.
    setMessage(
      "Jeigu paskyra su šiuo el. paštu egzistuoja, gausite slaptažodžio atkūrimo nuorodą."
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-topbar">
        <a className="auth-brand" href="/">
          MB „Arvigita“
        </a>

        <a className="auth-home-link" href="/prisijungti">
          Grįžti į prisijungimą
        </a>
      </div>

      <section className="auth-main">
        <div className="auth-card">
          <span className="section-label">PASKYROS ATKŪRIMAS</span>

          <h1>Atkurti slaptažodį</h1>

          <p className="auth-intro">
            Įveskite el. pašto adresą, naudojamą jūsų paskyrai.
          </p>

          {message && (
            <div className="auth-message auth-message-success" role="status">
              {message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">El. paštas</label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Siunčiama..." : "Siųsti atkūrimo nuorodą"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}