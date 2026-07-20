"use client";

import React, { useRef, useState } from 'react';
import Hero from './components/Hero';

export default function Page() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div>
      <Hero />

      {/* SECTIE: 3 GOEDE REDENEN */}
      <section className="reasons-section">
        <div className="reasons-container">
          
          <h2 className="reasons-main-title">
            3 goede redenen om te kiezen voor CorusBank
          </h2>

          {/* Raster op PC / Horizontale slider op mobiel */}
          <div 
            className="reasons-grid" 
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            
            {/* KAART 1 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-location.avif" alt="Dichtbij" />
              </div>
              <div className="reason-content">
                <h3>Dichtbij</h3>
                <p>Een uitgebreid netwerk van kantoren en partners om altijd aan uw zijde te staan.</p>
              </div>
            </div>

            {/* KAART 2 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-snap.avif" alt="Eenvoud" />
              </div>
              <div className="reason-content">
                <h3>Eenvoud</h3>
                <p>Onze missie: uw dagelijks financieel beheer soepeler en toegankelijker maken.</p>
              </div>
            </div>

            {/* KAART 3 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-affordable.avif" alt="Transparantie" />
              </div>
              <div className="reason-content">
                <h3>Transparantie</h3>
                <p>Duidelijke tarieven, scherpe rentevoeten en geen verborgen kosten.</p>
              </div>
            </div>

          </div>

          {/* Indicatoren (Dots) - Alleen zichtbaar op mobiel */}
          <div className="reasons-mobile-dots">
            {[0, 1, 2].map((index) => (
              <span 
                key={index} 
                className={`reasons-dot ${index === activeIndex ? 'active' : ''}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTIE LENINGEN */}
      <section className="credit-section">
        {/* CONSUMPTIEF KREDIET */}
        <div className="credit-container">
          <div className="credit-image-box">
            <img src="/img/sofa.png" alt="CorusCredit Lening op afbetaling" />
          </div>
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>CorusCredit: Een vaste en transparante rentevoet voor uw projecten.</h2>
            <p>
              Profiteer van optimale voorwaarden voor de gehele looptijd van uw lening en houd uw budget onder controle zonder verassingen.
            </p>
            <a style={{textDecoration: "none"}} href='/nl/calcul-pret' className="btn-yellow-pill">
              Naar de leningcalculator ➔
            </a>
          </div>
        </div>

        {/* HYPOTHEEK */}
        <div className="credit-container">
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>Corus Immo: Breng uw vastgoedproject tot leven.</h2>
            <p>
              Deskundig advies en begeleiding op maat bij de aankoop van uw hoofd- of tweede verblijf.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Ontdek vastgoedoplossingen ➔
            </a>
          </div>
          <div className="credit-image-box">
            <img src="/img/wohnhome.png" alt="Corus Immo" />
          </div>
        </div>
      </section>

      {/* SECTIE NIEUWS */}
      <section className="news-section">
        <div className="news-container">
          
          <div className="news-header">
            <div className="news-accent-line"></div>
            <h2 className="news-title">Wat is er nieuw?</h2>
          </div>

          <div className="news-grid">
            {/* KAART 1 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-costs.avif" alt="Vaste kosten verlagen" />
              </div>
              <div className="news-content">
                <h3>Budget optimaliseren</h3>
                <p>Ontdek onze praktische tips om uw maandelijkse uitgaven effectief te identificeren en te verlagen.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Meer informatie</a>
              </div>
            </div>

            {/* KAART 2 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-banking.jpg" alt="Online Bankieren" />
              </div>
              <div className="news-content">
                <h3>De CorusApp</h3>
                <p>Beheer al uw rekeningen in een handomdraai dankzij onze veilige mobiele oplossing.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Meer informatie</a>
              </div> 
            </div>

            {/* KAART 3 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-money.avif" alt="Financiële stabiliteit" />
              </div>
              <div className="news-content">
                <h3>Langetermijnstabiliteit</h3>
                <p>Waarom het opbouwen van een solide spaarstrategie de sleutel is tot een zorgeloze toekomst.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Meer informatie</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTIE EXTRA DIENSTEN */}
      <section className="ing-services-section">
        <div className="ing-services-container">
          
          <div className="ing-services-image-box">
            <img src="/img/Bank99_Handy_alpha-blk_mitBadge.jpg" alt="CorusBank op smartphone" />
          </div>

          <div className="ing-services-content">
            <div className="ing-accent-line"></div>
            <h2>Altijd verbonden.<br />Altijd aan uw zijde.</h2>
            
            <div className="ing-text-block">
              <h3>Heeft u persoonlijk advies nodig?</h3>
              <p>
                Onze financieel adviseurs beantwoorden al uw vragen en begeleiden u bij elke stap. Alle nuttige informatie vindt u <a href="#" className="ing-link">hier</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}