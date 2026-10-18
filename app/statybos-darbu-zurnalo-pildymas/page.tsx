'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StatybosZurnaloPildymas() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Užklausa dėl žurnalo pildymo: ${name}`);
    const body = encodeURIComponent(
      `Vardas / Įmonė: ${name}\n` +
      `Kontaktai: ${contact}\n\n` +
      `Žinutė / Objekto info:\n${message}`
    );
    window.location.href = `mailto:info.arvigita@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="public-site">
      {/* HERO SECTION */}
      <section className="hero-premium">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-premium-inner">
            <div className="hero-main">
              <span className="hero-eyebrow">
                PROFESIONALIOS STATYBOS PASLAUGOS
              </span>
              <h1>
                Elektroninio statybos darbų žurnalo <span>pildymas</span>
              </h1>
              <p className="hero-lead">
                Taupykite laiką ir išvenkite klaidų. Patikėkite statybos darbų žurnalo pildymą bei dokumentacijos tvarkymą MB „Arvigita“ specialistams, užtikrinantiems visų normatyvų ir teisinių reikalavimų atitiktį.
              </p>
              <div className="hero-actions">
                <a href="#kontaktai" className="button button-gold">
                  Užsisakyti paslaugą
                </a>
                <a href="tel:+37062633463" className="button button-hero-secondary">
                  📞 +370 626 33463
                </a>
              </div>
            </div>

            {/* HERO VISUAL CARD (ORIGINALUS GRAFINIS ELEMENTAS) */}
            <div className="hero-visual">
              <div className="hero-visual-card">
                <div className="hero-visual-top">
                  <span>Elektroninis statybos žurnalas</span>
                </div>
                <div className="hero-screen">
                  <div className="hero-screen-sidebar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="hero-screen-content">
                    <div className="screen-title"></div>
                    <div className="screen-row">
                      <i></i>
                      <b></b>
                    </div>
                    <div className="screen-row">
                      <i></i>
                      <b></b>
                    </div>
                    <div className="screen-row">
                      <i></i>
                      <b></b>
                    </div>
                  </div>
                </div>
                <div className="hero-visual-caption">
                  <strong>MB „Arvigita“</strong>
                  <span>100% Teisinė atitiktis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BENEFITS STRIP */}
        <div className="container">
          <div className="hero-benefits">
            <div className="hero-benefit">
              <div className="benefit-icon">✓</div>
              <div>
                <strong>Atitiktis STR</strong>
                <span>Pagal visus LR teisės aktus</span>
              </div>
            </div>
            <div className="hero-benefit">
              <div className="benefit-icon">⏱</div>
              <div>
                <strong>Laiko taupymas</strong>
                <span>Viskas sutvarkoma laiku</span>
              </div>
            </div>
            <div className="hero-benefit">
              <div className="benefit-icon">🏛</div>
              <div>
                <strong>Sklandus pridavimas</strong>
                <span>Be papildomų rūpesčių</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section edz-section">
        <div className="container">
          <div className="edz-copy" style={{ maxWidth: '850px', margin: '0 auto 60px' }}>
            <span className="section-label">Apie paslaugą</span>
            <h2>Kodėl verta patikėti žurnalo pildymą mums?</h2>
            <p className="section-intro">
              Statybos darbų žurnalas yra esminis dokumentas, įrodantis atliktų darbų kokybę bei atitiktį projektui. Netiksliai arba ne laiku užpildytas žurnalas gali stabdyti statinio pridavimo procedūras ar sukelti papildomų teisinių rizikų.
            </p>
          </div>

          <div className="feature-list-premium" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div>
                <h3>Paskyros ir žurnalo registravimas</h3>
                <p>
                  Sukuriame ir suadministruojame paskyrą elektroninio žurnalo sistemoje, užregistruojame sutarties šalis bei atsakingus asmenis.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number feature-number-teal">02</div>
              <div>
                <h3>Kasdienis žurnalo pildymas</h3>
                <p>
                  Reguliariai fiksuojame atliekamus darbus, oro sąlygas, panaudotas medžiagas, mechanizmus bei darbuotojų skaičių objekte.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <div>
                <h3>Užslėptų darbų aktų tvarkymas</h3>
                <p>
                  Laiku parengiame užslėptų darbų ir paslėptų konstrukcijų patikrinimo aktus bei suderiname juos su technine priežiūra.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number feature-number-teal">04</div>
              <div>
                <h3>Atitikties deklaracijos ir sertifikatai</h3>
                <p>
                  Segame visų naudojamų statybos produktų atitikties deklaracijas, sertifikatus bei laboratorinių bandymų protokolus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKTAI IR FORMA */}
      <section id="kontaktai" className="section" style={{ background: 'var(--ar-navy-950)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
            <span className="section-label section-label-gold">SUSISIEKITE</span>
            <h2 style={{ color: '#ffffff' }}>Turite klausimų ar norite gauti pasiūlymą?</h2>
            <p style={{ color: '#b9cad6', marginTop: '14px', fontSize: '16px' }}>
              Užpildykite užklausą arba susisiekite tiesiogiai nurodytais kontaktais.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'start' }}>
            {/* KONTAKTŲ KORTELĖ */}
            <div style={{
              background: 'var(--ar-navy-900)',
              padding: '30px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'var(--ar-shadow)'
            }}>
              <h3 style={{ color: 'var(--ar-gold-450)', fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>
                MB „Arvigita“
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '16px', color: '#d6e3ec' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--ar-gold-450)', fontSize: '20px' }}>📞</span>
                  <a href="tel:+37062633463" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    +370 626 33463
                  </a>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'break-all' }}>
                  <span style={{ color: 'var(--ar-gold-450)', fontSize: '20px' }}>✉️</span>
                  <a href="mailto:info.arvigita@gmail.com" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    info.arvigita@gmail.com
                  </a>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--ar-gold-450)', fontSize: '20px' }}>🌐</span>
                  <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    www.arvigita.lt
                  </Link>
                </p>
              </div>
            </div>

            {/* FORMA */}
            <form onSubmit={handleSubmit} style={{
              background: '#ffffff',
              padding: '30px',
              borderRadius: '16px',
              color: 'var(--ar-text)',
              boxShadow: 'var(--ar-shadow)'
            }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '14px' }}>
                  Vardas / Įmonė
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jūsų vardas arba įmonė"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '14px' }}>
                  Telefonas arba el. paštas
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+370 626 33463 arba info@..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '14px' }}>
                  Pastabos / Objekto informacija
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Trumpai aprašykite objektą..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="button button-gold"
                style={{ width: '100%', cursor: 'pointer' }}
              >
                Siųsti užklausą
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--ar-navy-900)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '24px 0', textAlign: 'center', color: '#b9cad6', fontSize: '14px' }}>
        <div className="container">
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} MB „Arvigita“. Visos teisės saugomos.</p>
        </div>
      </footer>
    </div>
  );
}