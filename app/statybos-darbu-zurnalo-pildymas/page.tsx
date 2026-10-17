import React from 'react';
import Link from 'next/link';
import type { Metadata, Viewport } from 'next';

// Mobiliesiems įrenginiams būtini nustatymai
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Statybos darbų žurnalo pildymas | MB „Arvigita“',
  description: 'Profesionalus elektroninio statybos darbų žurnalo pildymas, tvarkymas ir konsultacijos. Užtikriname atitiktį LR teisės aktams bei sklandų statinio pridavimo procesą.',
};

export default function StatybosZurnaloPildymas() {
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

            {/* HERO VISUAL CARD */}
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
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ar-navy-900)', margin: '0 0 6px' }}>
                  Paskyros ir žurnalo registravimas
                </h3>
                <p style={{ margin: 0, color: 'var(--ar-muted)', fontSize: '15px' }}>
                  Sukuriame ir suadministruojame paskyrą elektroninio žurnalo sistemoje, užregistruojame sutarties šalis bei atsakingus asmenis.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number feature-number-teal">02</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ar-navy-900)', margin: '0 0 6px' }}>
                  Kasdienis žurnalo pildymas
                </h3>
                <p style={{ margin: 0, color: 'var(--ar-muted)', fontSize: '15px' }}>
                  Reguliariai fiksuojame atliekamus darbus, oro sąlygas, panaudotas medžiagas, mechanizmus bei darbuotojų skaičių objekte.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ar-navy-900)', margin: '0 0 6px' }}>
                  Užslėptų darbų aktų tvarkymas
                </h3>
                <p style={{ margin: 0, color: 'var(--ar-muted)', fontSize: '15px' }}>
                  Laiku parengiame užslėptų darbų ir paslėptų konstrukcijų patikrinimo aktus bei suderiname juos su technine priežiūra.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number feature-number-teal">04</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ar-navy-900)', margin: '0 0 6px' }}>
                  Atitikties deklaracijos ir sertifikatai
                </h3>
                <p style={{ margin: 0, color: 'var(--ar-muted)', fontSize: '15px' }}>
                  Segame visų naudojamų statybos produktų atitikties deklaracijas, sertifikatus bei laboratorinių bandymų protokolus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKTAI */}
      <section id="kontaktai" className="section" style={{ background: 'var(--ar-navy-950)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
            <span className="section-label section-label-gold">SUSISIEKITE</span>
            <h2 style={{ color: '#ffffff' }}>Turite klausimų ar norite gauti pasiūlymą?</h2>
            <p style={{ color: '#b9cad6', marginTop: '14px', fontSize: '16px' }}>
              Susisiekite su mumis tiesiogiai el. paštu arba telefonu.
            </p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--ar-navy-900)',
              padding: '36px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'var(--ar-shadow)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'var(--ar-gold-450)', fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>
                MB „Arvigita“
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '18px', color: '#d6e3ec' }}>
                <p style={{ margin: 0 }}>
                  📞 Telefonas:{' '}
                  <a href="tel:+37062633463" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    +370 626 33463
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  ✉️ El. paštas:{' '}
                  <a href="mailto:info.arvigita@gmail.com" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    info.arvigita@gmail.com
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  🌐 Svetainė:{' '}
                  <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    www.arvigita.lt
                  </Link>
                </p>
              </div>

              <div style={{ marginTop: '30px' }}>
                <a href="mailto:info.arvigita@gmail.com?subject=U%C5%BEklausa%20d%C4%97l%20statybos%20%C5%BEurnalo" className="button button-gold" style={{ width: '100%' }}>
                  Rašyti el. laišką
                </a>
              </div>
            </div>
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