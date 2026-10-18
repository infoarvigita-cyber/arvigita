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
    <div className="public-site w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="hero-premium px-4 py-12 md:py-20 text-white relative">
        <div className="hero-overlay"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="hero-premium-inner flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="hero-main flex-1 text-center lg:text-left">
              <span className="hero-eyebrow inline-block text-xs md:text-sm font-semibold tracking-wider text-amber-400 uppercase mb-3">
                PROFESIONALIOS STATYBOS PASLAUGOS
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Elektroninio statybos darbų žurnalo <span className="text-amber-400">pildymas</span>
              </h1>
              <p className="hero-lead text-slate-300 text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
                Taupykite laiką ir išvenkite klaidų. Patikėkite statybos darbų žurnalo pildymą bei dokumentacijos tvarkymą MB „Arvigita“ specialistams, užtikrinantiems visų normatyvų ir teisinių reikalavimų atitiktį.
              </p>
              <div className="hero-actions flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#kontaktai" className="button button-gold px-6 py-3.5 rounded-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition text-center">
                  Užsisakyti paslaugą
                </a>
                <a href="tel:+37062633463" className="button button-hero-secondary px-6 py-3.5 rounded-lg font-bold border border-slate-600 hover:bg-slate-800 transition text-center">
                  📞 +370 626 33463
                </a>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="hero-visual w-full lg:w-1/2 max-w-md mx-auto">
              <div className="hero-visual-card bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="hero-visual-top pb-4 border-b border-slate-800 text-amber-400 font-bold text-sm">
                  <span>Elektroninis statybos žurnalas</span>
                </div>
                <div className="hero-screen py-6 space-y-3">
                  <div className="bg-slate-800 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-800 h-3 rounded w-full"></div>
                  <div className="bg-slate-800 h-3 rounded w-5/6"></div>
                </div>
                <div className="hero-visual-caption pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <strong className="text-white font-semibold">MB „Arvigita“</strong>
                  <span className="text-teal-400">100% Teisinė atitiktis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BENEFITS STRIP */}
        <div className="container mx-auto max-w-6xl mt-12">
          <div className="hero-benefits grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="hero-benefit flex items-center gap-4">
              <div className="benefit-icon text-amber-400 text-2xl font-bold">✓</div>
              <div>
                <strong className="block text-white font-bold text-sm">Atitiktis STR</strong>
                <span className="text-xs text-slate-400">Pagal visus LR teisės aktus</span>
              </div>
            </div>
            <div className="hero-benefit flex items-center gap-4">
              <div className="benefit-icon text-amber-400 text-2xl font-bold">⏱</div>
              <div>
                <strong className="block text-white font-bold text-sm">Laiko taupymas</strong>
                <span className="text-xs text-slate-400">Viskas sutvarkoma laiku</span>
              </div>
            </div>
            <div className="hero-benefit flex items-center gap-4">
              <div className="benefit-icon text-amber-400 text-2xl font-bold">🏛</div>
              <div>
                <strong className="block text-white font-bold text-sm">Sklandus pridavimas</strong>
                <span className="text-xs text-slate-400">Be papildomų rūpesčių</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT / PASLAUGOS INFORMACIJA */}
      <section className="section edz-section py-12 md:py-20 px-4 bg-white text-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="section-label text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
              Apie paslaugą
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
              Kodėl verta patikėti žurnalo pildymą mums?
            </h2>
            <p className="section-intro text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
              Statybos darbų žurnalas yra esminis dokumentas, įrodantis atliktų darbų kokybę bei atitiktį projektui. Netiksliai arba ne laiku užpildytas žurnalas gali stabdyti statinio pridavimo procedūras ar sukelti papildomų teisinių rizikų.
            </p>
          </div>

          <div className="feature-list-premium space-y-6">
            <div className="feature-item p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start">
              <div className="feature-number text-amber-500 font-black text-2xl sm:text-3xl">01</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Paskyros ir žurnalo registravimas
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sukuriame ir suadministruojame paskyrą elektroninio žurnalo sistemoje, užregistruojame sutarties šalis bei atsakingus asmenis.
                </p>
              </div>
            </div>

            <div className="feature-item p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start">
              <div className="feature-number text-teal-600 font-black text-2xl sm:text-3xl">02</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Kasdienis žurnalo pildymas
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Reguliariai fiksuojame atliekamus darbus, oro sąlygas, panaudotas medžiagas, mechanizmus bei darbuotojų skaičių objekte.
                </p>
              </div>
            </div>

            <div className="feature-item p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start">
              <div className="feature-number text-amber-500 font-black text-2xl sm:text-3xl">03</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Užslėptų darbų aktų tvarkymas
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Laiku parengiame užslėptų darbų ir paslėptų konstrukcijų patikrinimo aktus bei suderiname juos su technine priežiūra.
                </p>
              </div>
            </div>

            <div className="feature-item p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start">
              <div className="feature-number text-teal-600 font-black text-2xl sm:text-3xl">04</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Atitikties deklaracijos ir sertifikatai
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Segame visų naudojamų statybos produktų atitikties deklaracijas, sertifikatus bei laboratorinių bandymų protokolus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKTAI IR FORMA */}
      <section id="kontaktai" className="section py-12 md:py-20 px-4 bg-slate-950 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="section-label text-amber-400 font-bold text-xs uppercase tracking-wider block mb-2">
              SUSISIEKITE
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
              Turite klausimų ar norite gauti pasiūlymą?
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Užpildykite užklausą arba susisiekite tiesiogiai nurodytais kontaktais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* KONTAKTŲ KORTELĖ */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-amber-400 text-xl font-bold mb-6">
                MB „Arvigita“
              </h3>
              <div className="space-y-4 text-slate-300 text-base">
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">📞</span>
                  <a href="tel:+37062633463" className="hover:text-white transition font-bold">
                    +370 626 33463
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">✉️</span>
                  <a href="mailto:info.arvigita@gmail.com" className="hover:text-white transition font-bold break-all">
                    info.arvigita@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">🌐</span>
                  <Link href="/" className="hover:text-white transition font-bold">
                    www.arvigita.lt
                  </Link>
                </p>
              </div>
            </div>

            {/* FORMA */}
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl text-slate-900 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Vardas / Įmonė
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jūsų vardas arba įmonė"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Telefonas arba el. paštas
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+370 626 33463 arba info@..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Pastabos / Objekto informacija
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Trumpai aprašykite objektą..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-lg transition cursor-pointer text-sm uppercase tracking-wide"
              >
                Siųsti užklausą
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-slate-500 text-xs px-4">
        <p>© {new Date().getFullYear()} MB „Arvigita“. Visos teisės saugomos.</p>
      </footer>
    </div>
  );
}