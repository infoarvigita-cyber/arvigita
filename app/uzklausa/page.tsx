"use client";

import { FormEvent, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { createClient } from "./lib/supabase/client";
type Service = {
  id: string;
  name: string;
  category: string;
};

export default function UzklausaPage() {
  const [clientType, setClientType] = useState<"individual" | "company">(
    "individual"
  );

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
const [turnstileToken, setTurnstileToken] = useState("");
const [turnstileKey, setTurnstileKey] = useState(0);

const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  useEffect(() => {
    const supabase = createClient();

    async function loadServices() {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, category")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Nepavyko įkelti paslaugų:", error);

        setErrorMessage(
          "Šiuo metu nepavyko įkelti paslaugų. Bandykite dar kartą."
        );

        setLoadingServices(false);
        return;
      }

      setServices(data ?? []);
      setLoadingServices(false);
    }

    void loadServices();
  }, []);

  function handleServiceChange(serviceId: string, checked: boolean) {
    setSelectedServices((current) => {
      if (checked) {
        return current.includes(serviceId)
          ? current
          : [...current, serviceId];
      }

      return current.filter((id) => id !== serviceId);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (selectedServices.length === 0) {
      setErrorMessage("Pasirinkite bent vieną paslaugą.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const contactName =
      clientType === "company"
        ? String(formData.get("contactPerson") ?? "").trim()
        : String(formData.get("fullName") ?? "").trim();

    const companyName =
      clientType === "company"
        ? String(formData.get("companyName") ?? "").trim()
        : null;

    const companyCode =
      clientType === "company"
        ? String(formData.get("companyCode") ?? "").trim()
        : null;

    const vatCode =
      clientType === "company"
        ? String(formData.get("vatCode") ?? "").trim() || null
        : null;

    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    const objectLocation =
      String(formData.get("objectAddress") ?? "").trim() || null;

    const message = String(formData.get("message") ?? "").trim();

    const privacyConsent = formData.get("privacyConsent") === "on";

    /*
     * Nematomą website lauką naudosime kaip honeypot.
     * Normalus lankytojas jo nepildys.
     */
    const website = String(formData.get("website") ?? "").trim();

    if (!turnstileToken) {
  setErrorMessage(
    "Nepavyko patvirtinti saugumo patikros. Palaukite kelias sekundes ir bandykite dar kartą."
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
  return;
}

setIsSubmitting(true);

    try {
      const response = await fetch("/api/uzklausa", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          clientType,
          contactName,
          companyName,
          companyCode,
          vatCode,
          email,
          phone,
          objectLocation,
          message,
          serviceIds: selectedServices,
privacyConsent,
website,
turnstileToken,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Užklausos pateikti nepavyko. Bandykite dar kartą."
        );
      }

      form.reset();
setSelectedServices([]);
setClientType("individual");
setTurnstileToken("");
setTurnstileKey((current) => current + 1);

      setSuccessMessage(
        "Užklausa sėkmingai pateikta. Susisieksime su jumis."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Užklausos pateikimo klaida:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Užklausos pateikti nepavyko. Patikrinkite duomenis ir bandykite dar kartą."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="inquiry-premium-page">
      {/* HEADER */}
      <header className="inquiry-header">
        <div className="container inquiry-header-inner">
          <a
            className="inquiry-brand"
            href="/"
            aria-label="MB Arvigita – pradžia"
          >
            <img
              src="/arvigita-logo.png"
              alt="MB Arvigita logotipas"
              className="inquiry-brand-logo"
            />

            <span className="inquiry-brand-copy">
              <strong>MB „Arvigita“</strong>
              <small>STATYBOS DOKUMENTACIJA IR ADMINISTRAVIMAS</small>
            </span>
          </a>

          <nav
            className="inquiry-nav"
            aria-label="Pagrindinė navigacija"
          >
            <a href="/#edz">EDŽ pildymas</a>
            <a href="/#paslaugos">Paslaugos</a>
            <a href="/#apie">Apie mus</a>
            <a href="/#kontaktai">Kontaktai</a>
          </nav>

          <a
            className="inquiry-header-contact"
            href="tel:+37062633463"
          >
            +370 626 33463
          </a>
        </div>
      </header>

      {/* INTRO */}
      <section className="inquiry-hero">
        <div className="container inquiry-hero-grid">
          <div className="inquiry-hero-copy">
            <a className="inquiry-back" href="/">
              ← Grįžti į pradžią
            </a>

            <span className="inquiry-eyebrow">
              INDIVIDUALUS PASIŪLYMAS
            </span>

            <h1>
              Papasakokite apie
              <span> savo poreikį</span>
            </h1>

            <p className="inquiry-hero-lead">
              Pasirinkite dominančias paslaugas ir pateikite
              pagrindinę informaciją. Įvertinsime jūsų poreikį ir
              susisieksime dėl tolimesnių žingsnių.
            </p>

            <div className="inquiry-trust-list">
              <div className="inquiry-trust-item">
                <span>✓</span>

                <div>
                  <strong>Individualus įvertinimas</strong>
                  <small>
                    Pasiūlymas rengiamas pagal jūsų situaciją.
                  </small>
                </div>
              </div>

              <div className="inquiry-trust-item">
                <span>✓</span>

                <div>
                  <strong>Aiškus bendravimas</strong>
                  <small>
                    Jei reikės papildomos informacijos – susisieksime.
                  </small>
                </div>
              </div>

              <div className="inquiry-trust-item">
                <span>✓</span>

                <div>
                  <strong>Konfidenciali informacija</strong>
                  <small>
                    Pateikti duomenys naudojami užklausai administruoti.
                  </small>
                </div>
              </div>
            </div>

            <div className="inquiry-direct-contact">
              <span>Norite pasitarti prieš pateikiant užklausą?</span>

              <a href="tel:+37062633463">
                +370 626 33463
              </a>

              <a href="mailto:info.arvigita@gmail.com">
                info.arvigita@gmail.com
              </a>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="inquiry-form-column">
            {successMessage && (
              <div
                className="inquiry-message inquiry-message-success"
                role="status"
              >
                <span className="inquiry-message-icon">✓</span>

                <div>
                  <strong>Užklausa priimta</strong>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div
                className="inquiry-message inquiry-message-error"
                role="alert"
              >
                <span className="inquiry-message-icon">!</span>

                <div>
                  <strong>Nepavyko pateikti užklausos</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form
              className="inquiry-premium-form"
              onSubmit={handleSubmit}
            >
              {/*
                HONEYPOT
                Laukas paslėptas nuo tikrų lankytojų.
                Botas, kuris automatiškai pildo visus input laukus,
                dažnai jį užpildys ir serveris užklausą atmes.
              */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label htmlFor="website">
                  Interneto svetainė
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="inquiry-form-top">
                <span className="inquiry-form-number">01</span>

                <div>
                  <span className="inquiry-form-label">
                    UŽKLAUSOS FORMA
                  </span>

                  <h2>Jūsų informacija</h2>
                </div>
              </div>

              {/* CLIENT TYPE */}
              <fieldset
                className="inquiry-client-type"
                disabled={isSubmitting}
              >
                <legend>Kliento tipas *</legend>

                <div className="inquiry-client-options">
                  <label
                    className={`inquiry-client-option ${
                      clientType === "individual"
                        ? "is-active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="clientType"
                      value="individual"
                      checked={clientType === "individual"}
                      onChange={() =>
                        setClientType("individual")
                      }
                    />

                    <span className="client-option-icon">○</span>

                    <span>
                      <strong>Fizinis asmuo</strong>
                      <small>Privatus klientas</small>
                    </span>
                  </label>

                  <label
                    className={`inquiry-client-option ${
                      clientType === "company"
                        ? "is-active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="clientType"
                      value="company"
                      checked={clientType === "company"}
                      onChange={() =>
                        setClientType("company")
                      }
                    />

                    <span className="client-option-icon">▦</span>

                    <span>
                      <strong>Juridinis asmuo</strong>
                      <small>Įmonė / organizacija</small>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* INDIVIDUAL */}
              {clientType === "individual" && (
                <div className="premium-field">
                  <label htmlFor="fullName">
                    Vardas ir pavardė *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Vardas Pavardė"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* COMPANY */}
              {clientType === "company" && (
                <div className="inquiry-fields-grid">
                  <div className="premium-field">
                    <label htmlFor="companyName">
                      Įmonės pavadinimas *
                    </label>

                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      autoComplete="organization"
                      placeholder="Įmonės pavadinimas"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="premium-field">
                    <label htmlFor="companyCode">
                      Įmonės kodas *
                    </label>

                    <input
                      id="companyCode"
                      name="companyCode"
                      type="text"
                      placeholder="Įmonės kodas"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="premium-field">
                    <label htmlFor="vatCode">
                      PVM mokėtojo kodas
                      <span> (jei yra)</span>
                    </label>

                    <input
                      id="vatCode"
                      name="vatCode"
                      type="text"
                      placeholder="LT..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="premium-field">
                    <label htmlFor="contactPerson">
                      Kontaktinis asmuo *
                    </label>

                    <input
                      id="contactPerson"
                      name="contactPerson"
                      type="text"
                      autoComplete="name"
                      placeholder="Vardas Pavardė"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* CONTACT */}
              <div className="inquiry-fields-grid">
                <div className="premium-field">
                  <label htmlFor="email">
                    El. paštas *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vardas@pastas.lt"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="premium-field">
                  <label htmlFor="phone">
                    Telefono numeris *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+370..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="premium-field">
                <label htmlFor="objectAddress">
                  Objekto / paslaugos vietos adresas
                  <span> (jei taikoma)</span>
                </label>

                <input
                  id="objectAddress"
                  name="objectAddress"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Miestas, adresas"
                  disabled={isSubmitting}
                />
              </div>

              {/* SERVICES */}
              <fieldset
                className="inquiry-services"
                disabled={isSubmitting}
              >
                <div className="inquiry-services-heading">
                  <div>
                    <span className="inquiry-form-number">
                      02
                    </span>

                    <div>
                      <span className="inquiry-form-label">
                        PASLAUGOS
                      </span>

                      <legend>
                        Pasirinkite paslaugas *
                      </legend>
                    </div>
                  </div>

                  <small>Galima pasirinkti kelias</small>
                </div>

                {loadingServices ? (
                  <div className="inquiry-loading">
                    Įkeliamos paslaugos...
                  </div>
                ) : (
                  <div className="inquiry-service-options">
                    {services.map((service) => {
                      const checked =
                        selectedServices.includes(
                          service.id
                        );

                      return (
                        <label
                          className={`inquiry-service-option ${
                            checked
                              ? "is-selected"
                              : ""
                          }`}
                          key={service.id}
                        >
                          <input
                            type="checkbox"
                            name="services"
                            value={service.id}
                            checked={checked}
                            onChange={(event) =>
                              handleServiceChange(
                                service.id,
                                event.target.checked
                              )
                            }
                          />

                          <span className="service-check">
                            {checked ? "✓" : ""}
                          </span>

                          <span className="service-option-copy">
                            <strong>
                              {service.name}
                            </strong>

                            {service.category && (
                              <small>
                                {service.category}
                              </small>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              {/* MESSAGE */}
              <div className="inquiry-description-section">
                <div className="inquiry-description-heading">
                  <span className="inquiry-form-number">
                    03
                  </span>

                  <div>
                    <span className="inquiry-form-label">
                      INFORMACIJA
                    </span>

                    <strong>
                      Trumpai aprašykite poreikį *
                    </strong>
                  </div>
                </div>

                <div className="premium-field">
                  <textarea
                    id="message"
                    name="message"
                    rows={7}
                    placeholder="Trumpai aprašykite objektą, reikalingus darbus, situaciją ar kitą svarbią informaciją..."
                    required
                    minLength={5}
                    maxLength={5000}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* PRIVACY */}
              <label className="inquiry-privacy">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  required
                  disabled={isSubmitting}
                />

                <span className="privacy-custom-check" />

                <span>
                  Sutinku, kad mano pateikti duomenys būtų
                  tvarkomi užklausos administravimo ir
                  atsakymo į ją tikslu. Susipažinau su{" "}
                  <a
                    href="/privatumo-politika"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privatumo politika
                  </a>
                  .
                </span>
              </label>
{/* CLOUDFLARE TURNSTILE */}
<div
  style={{
    marginTop: "22px",
    marginBottom: "22px",
    minHeight: "65px",
  }}
>
  {turnstileSiteKey ? (
    <Turnstile
      key={turnstileKey}
      siteKey={turnstileSiteKey}
      options={{
        theme: "light",
        size: "normal",
      }}
      onSuccess={(token) => {
        setTurnstileToken(token);
        setErrorMessage("");
      }}
      onExpire={() => {
        setTurnstileToken("");
      }}
      onError={() => {
        setTurnstileToken("");
        setErrorMessage(
          "Saugumo patikros nepavyko įkelti. Atnaujinkite puslapį ir bandykite dar kartą."
        );
      }}
    />
  ) : (
    <p style={{ color: "#b42318" }}>
      Saugumo patikra šiuo metu nepasiekiama.
    </p>
  )}
</div>
              {/* SUBMIT */}
              <div className="inquiry-submit-row">
                <button
                  className="inquiry-submit-button"
                  type="submit"
                  disabled={
  isSubmitting ||
  loadingServices ||
  !turnstileToken
}
                >
                  {isSubmitting
                    ? "Siunčiama..."
                    : "Pateikti užklausą"}

                  {!isSubmitting && <span>→</span>}
                </button>

                <p>
                  <span>✓</span>
                  Jūsų pateikta informacija nėra viešinama.
                </p>
              </div>

              <p className="inquiry-required-note">
                * Privalomi laukai
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="inquiry-contact-strip">
        <div className="container inquiry-contact-strip-inner">
          <div>
            <span>MB „ARVIGITA“</span>
            <strong>Turite klausimų?</strong>
            <p>Susisiekite – mielai padėsime.</p>
          </div>

          <div className="inquiry-contact-links">
            <a href="mailto:info.arvigita@gmail.com">
              <small>EL. PAŠTAS</small>
              <strong>
                info.arvigita@gmail.com
              </strong>
            </a>

            <a href="tel:+37062633463">
              <small>TELEFONAS</small>
              <strong>+370 626 33463</strong>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="inquiry-footer">
        <div className="container inquiry-footer-inner">
          <a
            className="inquiry-footer-brand"
            href="/"
          >
            <img
              src="/arvigita-logo.png"
              alt="MB Arvigita"
            />

            <strong>MB „Arvigita“</strong>
          </a>

          <div className="inquiry-footer-links">
            <a href="/">Pradžia</a>
            <a href="/#paslaugos">Paslaugos</a>
            <a href="/#kontaktai">Kontaktai</a>
            <a href="/privatumo-politika">
              Privatumo politika
            </a>
          </div>

          <p>
            © 2026 MB „Arvigita“. Visos teisės
            saugomos.
          </p>
        </div>
      </footer>
    </main>
  );
}