"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../uzklausa/lib/supabase/client";

export default function PrisijungtiPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(
        "Prisijungti nepavyko. Patikrinkite el. paštą ir slaptažodį."
      );
      return;
    }

    window.location.href = "/savitarnos";
  }

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/">
            MB „Arvigita“
          </a>

          <nav className="main-nav" aria-label="Pagrindinė navigacija">
            <a href="/">Pradžia</a>
            <a href="/uzklausa">Pateikti užklausą</a>
          </nav>
        </div>
      </header>

      <section className="auth-page">
        <div className="auth-card">
          <span className="section-label">KLIENTŲ SAVITARNA</span>

          <h1>Prisijungti</h1>

          <p className="auth-intro">
            Prisijunkite prie MB „Arvigita“ klientų savitarnos.
          </p>

          {errorMessage && (
            <div className="message message-error" role="alert">
              {errorMessage}
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

            <div className="form-group">
              <label htmlFor="password">Slaptažodis</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Jungiamasi..." : "Prisijungti"}
            </button>
          </form>

          <div className="auth-links">
            <a href="/pamirso-slaptazodi">
              Pamiršote slaptažodį?
            </a>
          </div>

          <a className="back-link" href="/">
            ← Grįžti į pradžią
          </a>
        </div>
      </section>
    </main>
  );
}