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
    <div className="min-h-screen bg-[#061d30] text-slate-100 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative px-4 py-12 md:py-24 bg-gradient-to-b from-[#061d30] to-[#04121f]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* Tekstinė dalis */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block text-xs md:text-sm font-bold tracking-widest text-amber-400 uppercase mb-3 bg-amber-400/10 px-3 py-1 rounded-full">
                PROFESIONALIOS STATYBOS PASLAUGOS
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                Elektroninio statybos darbų žurnalo <span className="text-amber-400">pildymas</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Taupykite laiką ir išvenkite klaidų. Patikėkite statybos darbų žurnalo pildymą bei dokumentacijos tvarkymą MB „Arvigita“ specialistams, užtikrinantiems visų normatyvų ir teisinių reikalavimų atitiktį.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#kontaktai" 
                  className="px-8 py-4 rounded-xl font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-lg text-center transition"
                >
                  Užsisakyti paslaugą
                </a>
                <a 
                  href="tel:+37062633463" 
                  className="px-8 py-4 rounded-xl font-extrabold text-white border-2 border-slate-700 hover:bg-slate-800 text-center transition"
                >
                  📞 +370 626 33463
                </a>
              </div>
            </div>

            {/* Grafinė kortelė */}
            <div className="w-full lg:w-[420px]">
              <div className="bg-[#092842] border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
                <div className="pb-4 border-b border-slate-700/60 text-amber-400 font-bold text-sm flex items-center justify-between">
                  <span>Elektroninis statybos žurnalas</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="py-6 space-y-3">
                  <div className="bg-slate-800/80 h-4 rounded-md w-4/5"></div>
                  <div className="bg-slate-800/80 h-3 rounded-md w-full"></div>
                  <div className="bg-slate-800/80 h-3 rounded-md w-3/4"></div>
                  <div className="bg-slate-800/80 h-3 rounded-md w-5/6"></div>
                </div>
                <div className="pt-4 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-300">
                  <strong className="text-white font-semibold">MB „Arvigita“</strong>
                  <span className="text-teal-400 font-bold">100% Teisinė atitiktis</span>
                </div>
              </div>
            </div>

          </div>

          {/* Pranašumų juosta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-[#092842]/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
              <span className="text-2xl text-amber-400 font-bold">✓</span>
              <div>
                <h4 className="font-bold text-sm text-white">Atitiktis STR</h4>
                <p className="text-xs text-slate-400">Pagal visus LR teisės aktus</p>
              </div>
            </div>
            <div className="bg-[#092842]/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
              <span className="text-2xl text-amber-400 font-bold">⏱</span>
              <div>
                <h4 className="font-bold text-sm text-white">Laiko taupymas</h4>
                <p className="text-xs text-slate-400">Viskas sutvarkoma laiku</p>
              </div>
            </div>
            <div className="bg-[#092842]/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
              <span className="text-2xl text-amber-400 font-bold">🏛</span>
              <div>
                <h4 className="font-bold text-sm text-white">Sklandus pridavimas</h4>
                <p className="text-xs text-slate-400">Be papildomų rūpesčių</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* APIE PASLAUGĄ / FUNKCIJOS */}
      <section className="py-16 md:py-24 px-4 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Apie paslaugą
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
              Kodėl verta patikėti žurnalo pildymą mums?
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Statybos darbų žurnalas yra esminis dokumentas, įrodantis atliktų darbų kokybę bei atitiktį projektui. Netiksliai arba ne laiku užpildytas žurnalas gali stabdyti statinio pridavimo procedūras.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
              <span className="text-2xl sm:text-3xl font-black text-amber-500">01</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Paskyros ir žurnalo registravimas</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Sukuriame ir suadministruojame paskyrą elektroninio žurnalo sistemoje, užregistruojame sutarties šalis bei atsakingus asmenis.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
              <span className="text-2xl sm:text-3xl font-black text-teal-600">02</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Kasdienis žurnalo pildymas</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Reguliariai fiksuojame atliekamus darbus, oro sąlygas, panaudotas medžiagas, mechanizmus bei darbuotojų skaičių objekte.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
              <span className="text-2xl sm:text-3xl font-black text-amber-500">03</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Užslėptų darbų aktų tvarkymas</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Laiku parengiame užslėptų darbų ir paslėptų konstrukcijų patikrinimo aktus bei suderiname juos su technine priežiūra.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
              <span className="text-2xl sm:text-3xl font-black text-teal-600">04</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Atitikties deklaracijos ir sertifikatai</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Segame visų naudojamų statybos produktų atitikties deklaracijas, sertifikatus bei laboratorinių bandymų protokolus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKTAI IR FORMA */}
      <section id="kontaktai" className="py-16 md:py-24 px-4 bg-[#04121f] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block mb-2">
              SUSISIEKITE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
              Turite klausimų ar norite gauti pasiūlymą?
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Užpildykite užklausą arba susisiekite tiesiogiai nurodytais kontaktais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Kontaktų kortelė */}
            <div className="bg-[#092842] p-8 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-amber-400 text-xl font-bold mb-6">MB „Arvigita“</h3>
              <div className="space-y-4 text-slate-300 text-base">
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">📞</span>
                  <a href="tel:+37062633463" className="hover:text-white font-bold transition">+370 626 33463</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">✉️</span>
                  <a href="mailto:info.arvigita@gmail.com" className="hover:text-white font-bold transition break-all">info.arvigita@gmail.com</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">🌐</span>
                  <Link href="/" className="hover:text-white font-bold transition">www.arvigita.lt</Link>
                </p>
              </div>
            </div>

            {/* Užklausos forma */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl text-slate-900 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Vardas / Įmonė</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jūsų vardas arba įmonė"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telefonas arba el. paštas</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+370 626 33463 arba info@..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pastabos / Objekto informacija</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Trumpai aprašykite objektą..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl shadow-md transition cursor-pointer text-sm uppercase tracking-wider"
              >
                Siųsti užklausą
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04121f] border-t border-slate-800 py-6 text-center text-slate-500 text-xs px-4">
        <p>© {new Date().getFullYear()} MB „Arvigita“. Visos teisės saugomos.</p>
      </footer>
    </div>
  );
}