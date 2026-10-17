import React from 'react';

export const metadata = {
  title: 'Statybos darbų žurnalo pildymas | MB Arvigita',
  description: 'Profesionalus statybos darbų žurnalo pildymas ir dokumentacijos tvarkymas. Užtikriname atitiktį teisės aktams, InfoStatyba ir sklandų statinio pridavimą.',
  keywords: [
    'statybos darbu zurnalo pildymas',
    'elektroninis statybos darbu zurnalas',
    'statybos dokumentacijos tvarkymas',
    'InfoStatyba žurnalas',
    'statinio pridavimas'
  ],
};

export default function StatybosZurnaloPildymas() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Viršutinė dalis (Hero) */}
        <section className="text-center space-y-4">
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">
            Dokumentacijos tvarkymo paslaugos
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Statybos darbų žurnalo pildymas
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Atsakingai ir laiku pildome popierinius bei elektroninius statybos darbų žurnalus. Užtikriname visišką atitiktį teisės aktams ir sklandų objekto pridavimą.
          </p>
          <div className="pt-4">
            <a
              href="/#kontaktai"
              className="inline-block bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-amber-300 transition duration-200"
            >
              Užsakyti pildymą / Gauti pasiūlymą
            </a>
          </div>
        </section>

        {/* Paslaugos vertė / Ką darome */}
        <section className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 space-y-6">
          <h2 className="text-2xl font-bold text-amber-400">
            Ką apima statybos darbų žurnalo pildymo paslauga?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Kasdienis / periodinis atliktų darbų registravimas</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Panaudotų medžiagų, atitikties deklaracijų ir sertifikatų apskaita</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Elektroninio žurnalo tvarkymas (InfoStatyba / VDVIS sistemoje)</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Statybos dalyvių, vykdytojų ir vadovų registras</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Pasirengimas Valstybinės teritorijų planavimo ir statybos inspekcijos patikrinimams</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Konsultacijos dėl reikalaujamų dokumetų komplektavimo</span>
            </li>
          </ul>
        </section>

        {/* Kodėl verta patikėti specialistams */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Kodėl verta rinktis MB „Arvigita“?</h2>
          <p className="text-gray-300 leading-relaxed">
            Statybų žurnalo pildymas reikalauja specifinių žinių ir nuolatinio dėmesio detalėms.
            Neteisingai arba ne laiku užpildytas žurnalas gali tapti pagrindine priežastimi, dėl kurios vėluoja statinio pridavimas arba skiriamos nuobaudos. Mūsų komanda pasirūpina, kad visa dokumentacija atitiktų naujausius Lietuvos Respublikos statybos techninius reglamentus (STR).
          </p>
        </section>

        {/* DUK (Dažniausiai užduodami klausimai) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-400">
            Dažniausiai užduodami klausimai (DUK)
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-semibold text-lg text-white">
                Ar pildote elektroninį statybos darbų žurnalą?
              </h3>
              <p className="text-gray-300 mt-2">
                Taip, pildome tiek elektroninius žurnalus atitinkamose valstybinėse ar privačiose sistemose, tiek tradicinius popierinius žurnalus.
              </p>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-semibold text-lg text-white">
                Kiek kainuoja statybos darbų žurnalo pildymo paslauga?
              </h3>
              <p className="text-gray-300 mt-2">
                Kaina priklauso nuo objekto dydžio, statybos trukmės ir reikalaujamo pildymo intensyvumo. Kiekvienam projektui pateikiame individualų pasiūlymą.
              </p>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
              <h3 className="font-semibold text-lg text-white">
                Kada verta pradėti pildyti statybos darbų žurnalą?
              </h3>
              <p className="text-gray-300 mt-2">
                Žurnalą būtina užregistruoti ir pradėti pildyti dar prieš pradedant bet kokius faktinius statybos darbus objekte.
              </p>
            </div>
          </div>
        </section>

        {/* Raginimas veikti */}
        <section className="text-center bg-amber-400/10 border border-amber-400/30 p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-bold text-amber-400">
            Reikia pagalbos su statybos žurnalu?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Susisiekite su mumis šiandien ir perimkime dokumentacijos rūpesčius į savo rankas!
          </p>
          <a
            href="/#kontaktai"
            className="inline-block bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-300 transition duration-200"
          >
            Susisiekti dėl žurnalo pildymo
          </a>
        </section>

      </div>
    </main>
  );
}