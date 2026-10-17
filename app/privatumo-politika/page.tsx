export default function PrivatumoPolitikaPage() {
  return (
    <main className="privacy-premium-page">
      {/* HEADER */}
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a
            className="privacy-brand"
            href="/"
            aria-label="MB Arvigita – pradžia"
          >
            <img
              src="/arvigita-logo.png"
              alt="MB Arvigita logotipas"
              className="privacy-brand-logo"
            />

            <span className="privacy-brand-copy">
              <strong>MB „Arvigita“</strong>
              <small>STATYBOS DOKUMENTACIJA IR ADMINISTRAVIMAS</small>
            </span>
          </a>

          <nav
            className="privacy-nav"
            aria-label="Pagrindinė navigacija"
          >
            <a href="/#edz">EDŽ pildymas</a>
            <a href="/#paslaugos">Paslaugos</a>
            <a href="/#apie">Apie mus</a>
            <a href="/#kontaktai">Kontaktai</a>
          </nav>

          <a className="privacy-header-cta" href="/uzklausa">
            Pateikti užklausą →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="privacy-hero">
        <div className="container privacy-hero-inner">
          <a className="privacy-back-link" href="/">
            ← Grįžti į pradžią
          </a>

          <span className="privacy-eyebrow">
            DUOMENŲ APSAUGA
          </span>

          <h1>
            Privatumo
            <span> politika</span>
          </h1>

          <p>
            Informacija apie tai, kaip MB „Arvigita“ tvarko ir saugo
            asmens duomenis naudojantis interneto svetaine bei
            pateikiant užklausą.
          </p>

          <div className="privacy-hero-meta">
            <span>
              <strong>Valdytojas</strong>
              MB „Arvigita“
            </span>

            <span>
              <strong>Kontaktas</strong>
              info.arvigita@gmail.com
            </span>

            <span>
              <strong>Atnaujinta</strong>
              2026 m. spalio 5 d.
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="privacy-content-section">
        <div className="container privacy-layout">
          {/* SIDE NAVIGATION */}
          <aside className="privacy-side">
            <div className="privacy-side-card">
              <span>PRIVATUMO POLITIKA</span>

              <nav aria-label="Privatumo politikos skyriai">
                <a href="#valdytojas">01. Duomenų valdytojas</a>
                <a href="#duomenys">02. Tvarkomi duomenys</a>
                <a href="#tikslai">03. Tvarkymo tikslai</a>
                <a href="#saugumas">04. Duomenų saugumas</a>
                <a href="#gavejai">05. Duomenų gavėjai</a>
                <a href="#saugojimas">06. Saugojimo laikotarpiai</a>
                <a href="#teises">07. Jūsų teisės</a>
                <a href="#pakeitimai">08. Politikos pakeitimai</a>
              </nav>

              <div className="privacy-side-contact">
                <small>KLAUSIMAI DĖL DUOMENŲ?</small>

                <a href="mailto:info.arvigita@gmail.com">
                  info.arvigita@gmail.com
                </a>

                <a href="tel:+37062633463">
                  +370 626 33463
                </a>
              </div>
            </div>
          </aside>

          {/* POLICY */}
          <article className="privacy-document">
            <div className="privacy-document-intro">
              <span>MB „ARVIGITA“</span>

              <h2>Privatumo ir asmens duomenų apsauga</h2>

              <p>
                Šioje privatumo politikoje pateikiama informacija apie
                tai, kaip MB „Arvigita“ tvarko asmens duomenis, kai
                asmuo naudojasi interneto svetaine arba pateikia
                užklausą dėl paslaugų.
              </p>
            </div>

            <section
              className="privacy-policy-section"
              id="valdytojas"
            >
              <div className="privacy-section-number">01</div>

              <div>
                <h2>Duomenų valdytojas</h2>

                <p>
                  Duomenų valdytojas – MB „Arvigita“.
                </p>

                <div className="privacy-contact-box">
                  <div>
                    <small>EL. PAŠTAS</small>

                    <a href="mailto:info.arvigita@gmail.com">
                      info.arvigita@gmail.com
                    </a>
                  </div>

                  <div>
                    <small>TELEFONAS</small>

                    <a href="tel:+37062633463">
                      +370 626 33463
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="duomenys"
            >
              <div className="privacy-section-number">02</div>

              <div>
                <h2>Tvarkomi asmens duomenys</h2>

                <p>
                  Priklausomai nuo pateikiamos užklausos, pasirinktų
                  paslaugų ir santykio su MB „Arvigita“, gali būti
                  tvarkomi šie duomenys:
                </p>

                <ul className="privacy-list">
                  <li>vardas ir pavardė;</li>
                  <li>el. pašto adresas;</li>
                  <li>telefono numeris;</li>
                  <li>įmonės pavadinimas ir įmonės kodas;</li>
                  <li>PVM mokėtojo kodas, kai taikoma;</li>
                  <li>kontaktinio asmens duomenys;</li>
                  <li>objekto ar paslaugos vietos informacija;</li>
                  <li>pasirinktos paslaugos;</li>
                  <li>užklausos turinys;</li>
                  <li>
                    sutartims, projektams ir paslaugų vykdymui
                    reikalinga informacija.
                  </li>
                </ul>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="tikslai"
            >
              <div className="privacy-section-number">03</div>

              <div>
                <h2>Duomenų tvarkymo tikslai</h2>

                <p>
                  Asmens duomenys gali būti tvarkomi siekiant:
                </p>

                <ul className="privacy-list">
                  <li>priimti ir administruoti užklausas;</li>
                  <li>
                    susisiekti su užklausą pateikusiu asmeniu;
                  </li>
                  <li>įvertinti kliento poreikį;</li>
                  <li>parengti individualų pasiūlymą;</li>
                  <li>sudaryti ir vykdyti sutartis;</li>
                  <li>teikti užsakytas paslaugas;</li>
                  <li>
                    vykdyti taikomas teisines ir apskaitos
                    prievoles;
                  </li>
                  <li>
                    užtikrinti informacinių sistemų ir duomenų
                    saugumą.
                  </li>
                </ul>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="saugumas"
            >
              <div className="privacy-section-number">04</div>

              <div>
                <h2>Duomenų saugumas</h2>

                <p>
                  MB „Arvigita“ taiko organizacines ir technines
                  priemones, skirtas apsaugoti tvarkomus asmens
                  duomenis nuo neteisėtos prieigos, pakeitimo,
                  atskleidimo, praradimo ar sunaikinimo.
                </p>

                <p>
                  Prieiga prie klientų informacijos suteikiama tik
                  tokia apimtimi, kuri reikalinga atitinkamoms
                  funkcijoms ir paslaugoms vykdyti.
                </p>

                <div className="privacy-security-box">
                  <span>✓</span>

                  <div>
                    <strong>Duomenų apsauga</strong>

                    <p>
                      Siekiame, kad kliento pateikta informacija būtų
                      tvarkoma atsakingai ir prieinama tik tada, kai
                      tai būtina paslaugoms suteikti.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="gavejai"
            >
              <div className="privacy-section-number">05</div>

              <div>
                <h2>Duomenų gavėjai ir paslaugų teikėjai</h2>

                <p>
                  Paslaugoms teikti gali būti naudojami informacinių
                  technologijų, duomenų saugojimo, elektroninio
                  pašto, apskaitos ar kiti paslaugų teikėjai.
                </p>

                <p>
                  Tokiems paslaugų teikėjams perduodama tik tiek
                  informacijos, kiek būtina konkrečiai paslaugai
                  suteikti arba teisės aktuose nustatytoms
                  prievolėms vykdyti.
                </p>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="saugojimas"
            >
              <div className="privacy-section-number">06</div>

              <div>
                <h2>Duomenų saugojimo laikotarpiai</h2>

                <p>
                  Asmens duomenys saugomi tiek laiko, kiek reikia
                  tikslams, dėl kurių jie buvo surinkti, įgyvendinti,
                  ir tiek, kiek jų saugojimą nustato taikomi teisės
                  aktai.
                </p>

                <p>
                  Pasibaigus duomenų tvarkymo tikslui ir nesant
                  teisinio pagrindo juos saugoti ilgiau, duomenys
                  turi būti pašalinami arba kitaip nustojami
                  tvarkyti.
                </p>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="teises"
            >
              <div className="privacy-section-number">07</div>

              <div>
                <h2>Duomenų subjekto teisės</h2>

                <p>
                  Teisės aktų nustatytais atvejais asmuo gali:
                </p>

                <ul className="privacy-list privacy-rights-list">
                  <li>prašyti susipažinti su savo duomenimis;</li>
                  <li>prašyti netikslius duomenis ištaisyti;</li>
                  <li>
                    teisės aktų nustatytais atvejais prašyti duomenis
                    ištrinti;
                  </li>
                  <li>prašyti apriboti duomenų tvarkymą;</li>
                  <li>
                    teisės aktų nustatytais atvejais nesutikti su
                    duomenų tvarkymu;
                  </li>
                  <li>
                    pasinaudoti kitomis taikomuose duomenų apsaugos
                    teisės aktuose numatytomis teisėmis.
                  </li>
                </ul>

                <p>
                  Dėl asmens duomenų ir savo teisių įgyvendinimo
                  galite kreiptis el. paštu{" "}
                  <a href="mailto:info.arvigita@gmail.com">
                    info.arvigita@gmail.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section
              className="privacy-policy-section"
              id="pakeitimai"
            >
              <div className="privacy-section-number">08</div>

              <div>
                <h2>Privatumo politikos pakeitimai</h2>

                <p>
                  Ši privatumo politika gali būti atnaujinama
                  pasikeitus interneto svetainės funkcionalumui,
                  naudojamiems paslaugų teikėjams, duomenų tvarkymo
                  procesams arba teisės aktų reikalavimams.
                </p>

                <p>
                  Aktualiausia privatumo politikos versija skelbiama
                  šioje interneto svetainėje.
                </p>
              </div>
            </section>

            <div className="privacy-final-notice">
              <div className="privacy-final-notice-icon">i</div>

              <div>
                <strong>Turite klausimų?</strong>

                <p>
                  Dėl privatumo politikos ar asmens duomenų tvarkymo
                  susisiekite su MB „Arvigita“ el. paštu{" "}
                  <a href="mailto:info.arvigita@gmail.com">
                    info.arvigita@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="privacy-cta">
        <div className="container privacy-cta-inner">
          <div>
            <span>MB „ARVIGITA“</span>
            <h2>Reikia mūsų paslaugų?</h2>
            <p>
              Pateikite užklausą ir aptarsime jūsų poreikį.
            </p>
          </div>

          <a href="/uzklausa">
            Pateikti užklausą →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="privacy-footer">
        <div className="container privacy-footer-inner">
          <a className="privacy-footer-brand" href="/">
            <img
              src="/arvigita-logo.png"
              alt="MB Arvigita"
            />

            <div>
              <strong>MB „Arvigita“</strong>
              <small>
                Statybos dokumentacija ir administravimas
              </small>
            </div>
          </a>

          <nav aria-label="Apatinė navigacija">
            <a href="/">Pradžia</a>
            <a href="/#paslaugos">Paslaugos</a>
            <a href="/#kontaktai">Kontaktai</a>
            <a href="/privatumo-politika">
              Privatumo politika
            </a>
          </nav>

          <p>
            © 2026 MB „Arvigita“. Visos teisės saugomos.
          </p>
        </div>
      </footer>
    </main>
  );
}