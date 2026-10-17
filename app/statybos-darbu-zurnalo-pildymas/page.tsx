import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Statybos darbų žurnalo pildymas | Arvigita',
  description: 'Profesionalus elektroninio statybos darbų žurnalo pildymas, tvarkymas ir konsultacijos. Užtikriname atitiktį LR teisės aktams bei sklandų statinio pridavimo procesą.',
  keywords: [
    'statybos darbu zurnalo pildymas',
    'elektroninis statybos darbu zurnalas',
    'statybos dokumentacijos tvarkymas',
    'InfoStatyba zurnalas',
    'statinio pridavimas'
  ],
};

export default function StatybosZurnaloPildymas() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Viršutinis puslapio skydelis (Hero Section) */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-900/50 rounded-full border border-blue-700/50">
            Profesionalios Statybos Paslaugos
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Elektroninio statybos darbų žurnalo pildymas ir tvarkymas
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Taupykite laiką ir išvenkite klaidų. Patikėkite statybos darbų žurnalo pildymą patyrusiems specialistams, užtikrinantiems visų normatyvų bei teisinių reikalavimų atitiktį.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#kontaktai"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Užsisakyti paslaugą / Konsultaciją
            </a>
            <a
              href="tel:+37060000000"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-700 text-base font-medium rounded-lg text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white transition duration-200"
            >
              📞 Skambinti dabar
            </a>
          </div>
        </div>
      </section>

      {/* Pagrindinis turinys */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* KODĖL VERTA RINKTIS */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Kodėl būtina profesionaliai pildyti statybos žurnalą?
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Statybos darbų žurnalas yra pagrindinis dokumentas, įrodantis atliktų darbų kokybę bei atitiktį projektui.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h3 className="text-xl font-semibold mb-2">Teisės aktų atitiktis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Užtikriname, kad visi įrašai būtų atlikti laiku ir laikantis galiojančių LR statybos įstatymų bei STR reikalavimų.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                ⏱️
              </div>
              <h3 className="text-xl font-semibold mb-2">Laiko taupymas</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Jums nereikės gilintis į elektroninių sistemų specifiką – visus techninius ir biurokratinius procesus atliksime už vas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                🏛️
              </div>
              <h3 className="text-xl font-semibold mb-2">Sklandus pridavimas</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kruopščiai parengta dokumentacija garantuoja greitą ir sklandų statinio atitikties deklaracijos patvirtinimą.
              </p>
            </div>
          </div>
        </section>

        {/* PASLAUGŲ EIGA */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">
            Ką apima statybos darbų žurnalo pildymo paslauga?
          </h2>
          <ul className="space-y-4">
            {[
              'Elektroninio žurnalo paskyros sukūrimas ir administravimas sistemoje',
              'Sutarties šalių, vadovų ir atsakomybių priskyrimas bei registracija',
              'Kasdienių statybos darbų, oro sąlygų ir panaudotų medžiagų žymėjimas',
              'Užslėptų darbų aktų bei paslėptų konstrukcijų dokumentavimas',
              'Būtinų atitikties deklaracijų, sertifikatų ir laboratorinių bandymų prisegimas',
              'Konsultacijos ir pagalba bendraujant su statybos inspektoriais bei technine priežiūra'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span className="text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* KONTAKTAI IR UŽKLAUSOS FORMA */}
        <section id="kontaktai" className="bg-slate-900 text-white p-8 sm:p-12 rounded-2xl shadow-xl">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Susisiekite dėl žurnalo pildymo
            </h2>
            <p className="text-slate-300">
              Turite klausimų ar norite gauti tikslų paslaugos pasiūlymą? Užpildykite užklausą arba susisiekite tiesiogiai.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Kontaktinė informacija */}
            <div className="space-y-6 bg-slate-800/60 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold text-blue-400">Kontaktai</h3>
              <div className="space-y-4 text-slate-300">
                <p className="flex items-center gap-3">
                  <span className="text-xl">🏢</span>
                  <span><strong>UAB „Arvigita“</strong></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span><a href="tel:+37060000000" className="hover:text-white transition">+370 600 00000</a></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span><a href="mailto:info@arvigita.lt" className="hover:text-white transition">info@arvigita.lt</a></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span><Link href="/" className="hover:text-white transition">www.arvigita.lt</Link></span>
                </p>
              </div>
            </div>

            {/* Greita užklausa */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Vardas / Įmonė</label>
                <input
                  type="text"
                  placeholder="Jūsų vardas"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">El. paštas arba Telefonas</label>
                <input
                  type="text"
                  placeholder="+370 600 00000"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Žinutė / Objekto informacija</label>
                <textarea
                  rows={3}
                  placeholder="Trumpai aprašykite savo objektą..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 shadow-md"
              >
                Siųsti užklausą
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Puslapio apčia (Footer) */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <div className="max-w-5xl mx-auto px-4">
          <p>© {new Date().getFullYear()} UAB „Arvigita“. Visos teisės saugomos.</p>
        </div>
      </footer>
    </div>
  );
}