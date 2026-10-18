'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StatybosZurnaloPildymas() {
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
          '_subject': `Nauja užklausa dėl EDŽ pildymo: ${name}`,
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
    <div className="public-site">
      <style jsx global>{`
        @media (max-width: 900px) {
          .hero-premium-inner {
            flex-direction: column !important;
            text-align: center !important;
            gap: 24px !important;
          }
          .hero-main {
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-main h1 {
            font-size: 26px !important;
            line-height: 1.25 !important;
          }
          .hero-lead {
            font-size: 15px !important;
            margin: 0 auto 20px !important;
          }
          .hero-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .hero-actions .button {
            width: 100% !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
          .hero-visual {
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 10px !important;
          }
          .hero-benefits {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .feature-item {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 20px !important;
          }
          .container {
            padding-left: 16px !important;
            padding-right: 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

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
          <div className="edz-copy" style={{ maxWidth: '850px', margin: '0 auto 40px' }}>
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
      <section id="kontaktai" className="section" style={{ background: 'var(--ar-navy-950, #04121f)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
            <span className="section-label section-label-gold">SUSISIEKITE</span>
            <h2 style={{ color: '#ffffff' }}>Turite klausimų ar norite gauti pasiūlymą?</h2>
            <p style={{ color: '#b9cad6', marginTop: '14px', fontSize: '16px' }}>
              Užpildykite užklausą arba susisiekite tiesiogiai nurodytais kontaktais.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <div style={{
              background: 'var(--ar-navy-900, #092842)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ color: '#f59e0b', fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>
                MB „Arvigita“
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', color: '#d6e3ec' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '20px' }}>📞</span>
                  <a href="tel:+37062633463" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    +370 626 33463
                  </a>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', wordBreak: 'break-all' }}>
                  <span style={{ color: '#f59e0b', fontSize: '20px' }}>✉️</span>
                  <a href="mailto:info.arvigita@gmail.com" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    info.arvigita@gmail.com
                  </a>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '20px' }}>🌐</span>
                  <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                    www.arvigita.lt
                  </Link>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              color: '#0f172a',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
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

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '13px' }}>
                  Vardas / Įmonė
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jūsų vardas arba įmonė"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '13px' }}>
                  Telefonas arba el. paštas
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+370 626 33463 arba info@..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '13px' }}>
                  Pastabos / Objekto informacija
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Trumpai aprašykite objektą..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button button-gold"
                style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Siunčiama...' : 'Siųsti užklausą'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--ar-navy-900, #092842)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px 0', textAlign: 'center', color: '#b9cad6', fontSize: '13px' }}>
        <div className="container">
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} MB „Arvigita“. Visos teisės saugomos.</p>
        </div>
      </footer>
    </div>
  );
}