'use client';

import React, { useState } from 'react';
import "./home-premium.css";

const benefits = [
  {
    icon: "✓",
    title: "Patikimumas",
    text: "Atsakingas požiūris į kiekvieną projektą",
  },
  {
    icon: "◇",
    title: "Profesionalumas",
    text: "Nuoseklus dokumentavimo procesas",
  },
  {
    icon: "◎",
    title: "Individualus dėmesys",
    text: "Sprendimai pagal konkretaus projekto poreikį",
  },
];

const edzFeatures = [
  {
    number: "01",
    title: "Žurnalo administravimas",
    text: "Elektroninio statybos darbų žurnalo pildymo proceso administravimas pagal sutartą paslaugų apimtį.",
  },
  {
    number: "02",
    title: "Informacijos sisteminimas",
    text: "Su atliekamais darbais susijusios informacijos nuoseklus valdymas ir dokumentavimo proceso priežiūra.",
  },
  {
    number: "03",
    title: "Individualus bendradarbiavimas",
    text: "Paslaugos organizuojamos atsižvelgiant į konkretaus objekto situaciją ir projekto poreikius.",
  },
];

const processSteps = [
  {
    number: "01",
    icon: "□",
    title: "Pateikiate užklausą",
    text: "Trumpai aprašote objektą, reikalingą paslaugą ir kitą svarbią informaciją.",
  },
  {
    number: "02",
    icon: "▤",
    title: "Įvertiname poreikį",
    text: "Susipažįstame su pateikta informacija ir, jei reikia, susisiekiame dėl papildomų duomenų.",
  },
  {
    number: "03",
    icon: "◇",
    title: "Suderiname pasiūlymą",
    text: "Paslaugų apimtis ir sąlygos nustatomos pagal konkrečią situaciją bei darbų poreikį.",
  },
  {
    number: "04",
    icon: "✓",
    title: "Pradedame darbus",
    text: "Suderinus sąlygas organizuojamas sutartų paslaugų vykdymas.",
  },
];

export default function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('https://formsubmit.co/ajax/info.arvigita@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'Vardas / Įmonė': name,
          'Kontaktai (Tel / El.paštas)': contact,
          'Žinutė / Objekto info': message,
          '_subject': `Nauja užklausa iš pagrindinio puslapio: ${name}`,
          '_captcha': 'false'
        })
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Ačiū! Jūsų užklausa sėkmingai išsiųsta. Susisieksime su jumis artimiausiu metu.'
        });
        setName('');
        setContact('');
        setMessage('');
      } else {
        throw new Error('Nepavyko išsiųsti žinutės.');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Įvyko klaida siunčiant užklausą. Prašome skambinti telefonu +370 626 33463 arba rašyti tiesiogiai el. paštu.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="arv-site">
      {/* HEADER */}
      <header className="arv-header">
        <div className="arv-container arv-header-inner">
          <a
            className="arv-brand"
            href="/"
            aria-label="MB Arvigita – pradžia"
          >
            <img
              src="/arvigita-logo.png"
              alt="MB Arvigita logotipas"
            />

            <span>
              <strong>MB „Arvigita“</strong>
              <small>
                STATYBOS DOKUMENTACIJA IR ADMINISTRAVIMAS
              </small>
            </span>
          </a>

          <nav
            className="arv-nav"
            aria-label="Pagrindinė navigacija"
          >
            <a href="#edz">EDŽ pildymas</a>
            <a href="#paslaugos">Paslaugos</a>
            <a href="#apie">Apie mus</a>
            <a href="#kontaktai">Kontaktai</a>

            <a
              className="arv-nav-cta"
              href="/uzklausa"
            >
              Pateikti užklausą
              <span>→</span>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="arv-hero">
        <div className="arv-hero-grid-lines" />

        <div className="arv-container arv-hero-inner">
          <div className="arv-hero-copy">
            <div className="arv-eyebrow">
              <span>MB „ARVIGITA“</span>
              <i />
            </div>

            <h1>
              Elektroninio
              <br />
              statybos darbų
              <br />
              <span>žurnalo pildymas</span>
            </h1>

            <p>
              Profesionalus elektroninio statybos darbų
              žurnalo administravimas ir pildymas,
              padedantis užtikrinti sklandų statybos
              procesą, nuoseklų dokumentavimą ir aiškią
              projekto eigą.
            </p>

            <div className="arv-hero-actions">
              <a
                className="arv-button arv-button-gold"
                href="/uzklausa"
              >
                Pateikti užklausą
                <span>→</span>
              </a>

              <a
                className="arv-button arv-button-outline"
                href="#edz"
              >
                Sužinoti daugiau
                <span>↓</span>
              </a>
            </div>
          </div>

          <div
            className="arv-hero-scene"
            aria-hidden="true"
          >
            <div className="arv-scene-glow" />

            <div className="arv-blueprint-lines">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="arv-house">
              <div className="arv-house-upper">
                <div className="arv-house-glass" />
                <div className="arv-house-glass" />
              </div>

              <div className="arv-house-lower">
                <div className="arv-house-window" />
                <div className="arv-house-window" />
                <div className="arv-house-door" />
              </div>

              <div className="arv-house-ground" />
            </div>

            <div className="arv-edz-dashboard">
              <div className="arv-dashboard-head">
                <div>
                  <small>ELEKTRONINIS ŽURNALAS</small>
                  <strong>EDŽ</strong>
                </div>

                <span className="arv-live">
                  AKTYVU
                </span>
              </div>

              <div className="arv-dashboard-list">
                <div>
                  <span>✓</span>
                  <strong>Darbų įrašai</strong>
                  <i />
                </div>

                <div>
                  <span>✓</span>
                  <strong>Nuotraukos</strong>
                  <i />
                </div>

                <div>
                  <span>✓</span>
                  <strong>Dokumentai</strong>
                  <i />
                </div>

                <div>
                  <span>✓</span>
                  <strong>Terminai</strong>
                  <i />
                </div>

                <div>
                  <span>✓</span>
                  <strong>Ataskaitos</strong>
                  <i />
                </div>
              </div>
            </div>

            <div className="arv-floating-document">
              <span>▤</span>
            </div>

            <div className="arv-floating-chart">
              <span>▥</span>
            </div>
          </div>
        </div>

        <div className="arv-container arv-benefits">
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <span className="arv-benefit-icon">
                {benefit.icon}
              </span>

              <div>
                <strong>{benefit.title}</strong>
                <small>{benefit.text}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EDŽ */}
      <section
        className="arv-section arv-edz-section"
        id="edz"
      >
        <div className="arv-section-orb arv-orb-one" />

        <div className="arv-container">
          <div className="arv-section-heading arv-section-heading-wide">
            <div>
              <span className="arv-section-label">
                PAGRINDINĖ PASLAUGA
              </span>

              <h2>
                Elektroninio statybos darbų
                <br />
                <span>žurnalo pildymas</span>
              </h2>
            </div>

            <p>
              MB „Arvigita“ teikia elektroninio statybos
              darbų žurnalo administravimo ir pildymo
              paslaugas. Paslaugos apimtis derinama
              individualiai pagal statybos objektą,
              vykdomus darbus ir kliento poreikius.
            </p>
          </div>

          <div className="arv-edz-layout">
            <div className="arv-edz-feature-column">
              {edzFeatures.map((feature) => (
                <article
                  className="arv-edz-feature"
                  key={feature.number}
                >
                  <span>{feature.number}</span>

                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </article>
              ))}

              <a
                className="arv-button arv-button-gold"
                href="/uzklausa"
              >
                Gauti individualų pasiūlymą
                <span>→</span>
              </a>
            </div>

            <div className="arv-edz-showcase">
              <div className="arv-edz-showcase-grid" />

              <div className="arv-edz-showcase-top">
                <span>EDŽ / PROJEKTAS</span>
                <strong>
                  Dokumentavimo procesas
                </strong>
              </div>

              <div className="arv-edz-screen">
                <div className="arv-edz-screen-sidebar">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="arv-edz-screen-main">
                  <div className="arv-edz-screen-title">
                    <div>
                      <small>
                        STATYBOS DARBŲ ŽURNALAS
                      </small>
                      <strong>
                        Projekto dokumentacija
                      </strong>
                    </div>

                    <span>● AKTYVU</span>
                  </div>

                  <div className="arv-screen-stats">
                    <div>
                      <small>DARBŲ ĮRAŠAI</small>
                      <strong>✓</strong>
                    </div>

                    <div>
                      <small>DOKUMENTAI</small>
                      <strong>✓</strong>
                    </div>

                    <div>
                      <small>PROCESAS</small>
                      <strong>✓</strong>
                    </div>
                  </div>

                  <div className="arv-screen-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              <div className="arv-edz-showcase-footer">
                <div>
                  <span>✓</span>

                  <p>
                    <strong>
                      Nuoseklus dokumentavimas
                    </strong>
                    Informacija viename procese
                  </p>
                </div>

                <div>
                  <span>◇</span>

                  <p>
                    <strong>
                      Mažiau administracinės naštos
                    </strong>
                    Aiškesnė projekto eiga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PASLAUGOS */}
      <section
        className="arv-section arv-services"
        id="paslaugos"
      >
        <div className="arv-container">
          <div className="arv-section-heading">
            <div>
              <span className="arv-section-label">
                MŪSŲ PASLAUGOS
              </span>

              <h2>
                Papildomos paslaugos
                <br />
                <span>
                  verslui ir statybos projektams
                </span>
              </h2>
            </div>

            <p>
              Be pagrindinės EDŽ pildymo paslaugos,
              MB „Arvigita“ teikia administravimo,
              konsultavimo, statybos ir remonto
              paslaugas.
            </p>
          </div>

          <div className="arv-services-grid">
            <article className="arv-service-card">
              <div className="arv-service-top">
                <span className="arv-service-icon">
                  ▣
                </span>
                <small>01</small>
              </div>

              <h3>Verslo administravimas</h3>

              <ul>
                <li>Bendras administravimas</li>
                <li>Darbuotojų dokumentacija</li>
                <li>Pirminė apskaita</li>
              </ul>

              <a href="/uzklausa">
                Pateikti užklausą
                <span>→</span>
              </a>
            </article>

            <article className="arv-service-card">
              <div className="arv-service-top">
                <span className="arv-service-icon arv-service-icon-tech">
                  ▤
                </span>
                <small>02</small>
              </div>

              <h3>
                Konsultavimo ir kitos paslaugos
              </h3>

              <ul>
                <li>Konsultacijos pagal poreikį</li>
                <li>
                  Pagalba dokumentų klausimais
                </li>
                <li>
                  Individualiai derinamos paslaugos
                </li>
              </ul>

              <a href="/uzklausa">
                Pateikti užklausą
                <span>→</span>
              </a>
            </article>

            <article className="arv-service-card">
              <div className="arv-service-top">
                <span className="arv-service-icon arv-service-icon-tech">
                  ◇
                </span>
                <small>03</small>
              </div>

              <h3>Statybos ir remonto darbai</h3>

              <ul>
                <li>
                  Namo statyba nuo pamatų iki raktų
                </li>
                <li>Remonto darbai</li>
                <li>
                  Individualiai derinami darbai
                </li>
              </ul>

              <a href="/uzklausa">
                Pateikti užklausą
                <span>→</span>
              </a>
            </article>

            <article className="arv-service-card arv-service-card-gold">
              <div className="arv-service-top">
                <span className="arv-service-icon">
                  ◎
                </span>
                <small>04</small>
              </div>

              <h3>Reikia kelių paslaugų?</h3>

              <p>
                Aprašykite savo situaciją ir reikalingus
                darbus. Įvertinsime poreikį ir aptarsime
                tinkamą sprendimą.
              </p>

              <a
                className="arv-card-button"
                href="/uzklausa"
              >
                Gauti pasiūlymą
                <span>→</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESAS */}
      <section
        className="arv-section arv-process"
        id="procesas"
      >
        <div className="arv-container">
          <div className="arv-process-heading">
            <span className="arv-section-label">
              BENDRADARBIAVIMAS
            </span>

            <h2>
              Aiškus kelias nuo užklausos
              <br />
              <span>iki paslaugos</span>
            </h2>

            <p>
              Paprastas ir aiškus procesas nuo pirmojo
              kontakto iki sutartų darbų vykdymo.
            </p>
          </div>

          <div className="arv-process-grid">
            {processSteps.map((step) => (
              <article
                className="arv-process-card"
                key={step.number}
              >
                <div className="arv-process-card-head">
                  <span>{step.number}</span>
                  <i>{step.icon}</i>
                </div>

                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APIE MUS */}
      <section
        className="arv-section arv-about"
        id="apie"
      >
        <div className="arv-container arv-about-grid">
          <div className="arv-about-copy">
            <span className="arv-section-label">
              APIE MB „ARVIGITA“
            </span>

            <h2>
              Tvarkingas procesas.
              <br />
              <span>Aiški komunikacija.</span>
              <br />
              Atsakingas požiūris.
            </h2>

            <p>
              Pagrindinė MB „Arvigita“ veiklos kryptis –
              elektroninio statybos darbų žurnalo
              pildymas ir administravimas.
            </p>

            <p>
              Taip pat teikiamos verslo
              administravimo, konsultavimo, statybos
              ir remonto paslaugos fiziniams ir
              juridiniams asmenims.
            </p>
          </div>

          <div className="arv-about-panel">
            <div className="arv-about-panel-line" />

            <span className="arv-about-panel-label">
              MŪSŲ POŽIŪRIS
            </span>

            <div className="arv-values">
              <article>
                <span>✓</span>
                <div>
                  <strong>Patikimumas</strong>
                  <p>
                    Atsakingas požiūris į kiekvieną
                    projektą.
                  </p>
                </div>
              </article>

              <article>
                <span>◎</span>
                <div>
                  <strong>Profesionalumas</strong>
                  <p>
                    Nuoseklus ir aiškiai organizuotas
                    procesas.
                  </p>
                </div>
              </article>

              <article>
                <span>◇</span>
                <div>
                  <strong>
                    Individualus dėmesys
                  </strong>
                  <p>
                    Sprendimai pagal konkretaus klienta
                    ir projekto poreikį.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKTAI IR FORMA */}
      <section
        className="arv-section arv-contact"
        id="kontaktai"
      >
        <div className="arv-container arv-contact-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          <div className="arv-contact-copy">
            <span className="arv-section-label">
              KONTAKTAI
            </span>

            <h2>
              Aptarkime jūsų
              <br />
              <span>projektą</span>
            </h2>

            <p>
              Turite klausimų ar norite aptarti
              reikalingas paslaugas? Susisiekite –
              įvertinsime jūsų poreikį.
            </p>

            <div className="arv-contact-details" style={{ marginTop: '24px' }}>
              <a href="mailto:info.arvigita@gmail.com">
                <span>✉</span>
                <div>
                  <small>EL. PAŠTAS</small>
                  <strong>info.arvigita@gmail.com</strong>
                </div>
                <i>→</i>
              </a>

              <a href="tel:+37062633463" style={{ marginTop: '12px' }}>
                <span>☎</span>
                <div>
                  <small>TELEFONAS</small>
                  <strong>+370 626 33463</strong>
                </div>
                <i>→</i>
              </a>
            </div>
          </div>

          {/* ELA. PAŠTO UŽKLAUSOS FORMA */}
          <form onSubmit={handleSubmit} style={{
            background: 'var(--ar-navy-900, #092842)',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
              Pateikti užklausą
            </h3>

            {statusMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                fontWeight: '600',
                background: statusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: statusMessage.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {statusMessage.text}
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>
                Vardas / Įmonė
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jūsų vardas arba įmonė"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>
                Telefonas arba el. paštas
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+370 626 33463 arba info@..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>
                Pastabos / Objekto informacija
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Trumpai aprašykite objektą..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="arv-button arv-button-gold"
              style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'center', opacity: loading ? 0.7 : 1, justifyContent: 'center' }}
            >
              {loading ? 'Siunčiama...' : 'Siųsti užklausą'}
              <span>→</span>
            </button>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="arv-final-cta">
        <div className="arv-final-grid" />

        <div className="arv-container arv-final-inner">
          <div>
            <span>MB „ARVIGITA“</span>

            <h2>
              Reikalingas patikimas
              <br />
              <strong>
                sprendimas jūsų projektui?
              </strong>
            </h2>

            <p>
              Pateikite užklausą – susisieksime ir
              aptarsime jūsų poreikį.
            </p>
          </div>

          <a
            className="arv-button arv-button-gold arv-final-button"
            href="#kontaktai"
          >
            Gauti pasiūlymą
            <span>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="arv-footer">
        <div className="arv-container arv-footer-grid">
          <div className="arv-footer-brand">
            <a href="/">
              <img
                src="/arvigita-logo.png"
                alt="MB Arvigita logotipas"
              />

              <span>
                <strong>MB „Arvigita“</strong>
                <small>
                  STATYBOS DOKUMENTACIJA IR
                  ADMINISTRAVIMAS
                </small>
              </span>
            </a>

            <p>
              Elektroninio statybos darbų žurnalo
              pildymas, administravimo, konsultavimo,
              statybos ir remonto paslaugos.
            </p>
          </div>

          <div className="arv-footer-column">
            <strong>Paslaugos</strong>
            <a href="#edz">EDŽ pildymas</a>
            <a href="#paslaugos">
              Kitos paslaugos
            </a>
            <a href="#procesas">Kaip dirbame</a>
          </div>

          <div className="arv-footer-column">
            <strong>Informacija</strong>
            <a href="#apie">Apie mus</a>
            <a href="#kontaktai">Kontaktai</a>
            <a href="#kontaktai">
              Pateikti užklausą
            </a>
            <a href="/privatumo-politika">
              Privatumo politika
            </a>
          </div>

          <div className="arv-footer-column">
            <strong>Kontaktai</strong>

            <a href="mailto:info.arvigita@gmail.com">
              info.arvigita@gmail.com
            </a>

            <a href="tel:+37062633463">
              +370 626 33463
            </a>
          </div>
        </div>

        <div className="arv-container arv-footer-bottom">
          <p>
            © {new Date().getFullYear()} MB „Arvigita“. Visos teisės
            saugomos.
          </p>

          <span>
            ELEKTRONINIS STATYBOS DARBŲ ŽURNALAS
          </span>
        </div>
      </footer>
    </main>
  );
}