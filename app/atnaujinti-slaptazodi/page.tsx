"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../uzklausa/lib/supabase/client";

export default function AtnaujintiSlaptazodiPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);

    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(
      formData.get("passwordConfirm") ?? ""
    );

    if (password.length < 8) {
      setErrorMessage("Slaptažodis turi būti bent 8 simbolių.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("Įvesti slaptažodžiai nesutampa.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(
        "Slaptažodžio pakeisti nepavyko. Atkūrimo nuoroda gali būti nebegaliojanti."
      );
      return;
    }

    setSuccessMessage("Slaptažodis sėkmingai pakeistas.");

    await supabase.auth.signOut();

    window.setTimeout(() => {
      window.location.replace("/prisijungti");
    }, 1500);
  }

  return (
    <main className="auth-shell">
      <div className="auth-topbar">
        <a className="auth-brand" href="/">
          MB „Arvigita“
        </a>
      </div>

      <section className="auth-main">
        <div className="auth-card">
          <span className="section-label">PASKYROS SAUGUMAS</span>

          <h1>Naujas slaptažodis</h1>

          <p className="auth-intro">
            Įveskite ir pakartokite naują paskyros slaptažodį.
          </p>

          {errorMessage && (
            <div className="auth-message auth-message-error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="auth-message auth-message-success" role="status">
              {successMessage}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Naujas slaptažodis</label>

              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm">
                Pakartokite slaptažodį
              </label>

              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Keičiama..." : "Pakeisti slaptažodį"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}