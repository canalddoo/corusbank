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

      {/* ABSCHNITT: 3 GUTE GRÜNDE */}
      <section className="reasons-section">
        <div className="reasons-container">
          
          <h2 className="reasons-main-title">
            3 gute Gründe, sich für CorusBank zu entscheiden
          </h2>

          {/* Raster auf PC / Horizontaler Slider auf Mobilgeräten */}
          <div 
            className="reasons-grid" 
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            
            {/* KARTE 1 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-location.avif" alt="Nähe" />
              </div>
              <div className="reason-content">
                <h3>Nähe</h3>
                <p>Ein umfangreiches Netz an Filialen und Partnern, um immer an Ihrer Seite zu sein.</p>
              </div>
            </div>

            {/* KARTE 2 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-snap.avif" alt="Einfachheit" />
              </div>
              <div className="reason-content">
                <h3>Einfachheit</h3>
                <p>Unsere Mission: Ihre tägliche Finanzverwaltung reibungsloser und zugänglicher zu gestalten.</p>
              </div>
            </div>

            {/* KARTE 3 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-affordable.avif" alt="Transparenz" />
              </div>
              <div className="reason-content">
                <h3>Transparenz</h3>
                <p>Klare Tarife, wettbewerbsfähige Zinsen und keine versteckten Gebühren.</p>
              </div>
            </div>

          </div>

          {/* Indikatoren (Dots) - Nur auf Mobilgeräten sichtbar */}
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

      {/* ABSCHNITT KREDITE */}
      <section className="credit-section">
        {/* KONSUMKREDIT */}
        <div className="credit-container">
          <div className="credit-image-box">
            <img src="/img/sofa.png" alt="CorusCredit Ratenkredit" />
          </div>
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>CorusCredit: Ein fester und transparenter Zinssatz für Ihre Projekte.</h2>
            <p>
              Profitieren Sie von optimalen Konditionen für die gesamte Laufzeit Ihres Kredits und behalten Sie Ihr Budget ohne böse Überraschungen im Griff.
            </p>
            <a style={{textDecoration: "none"}} href='/de/calcul-pret' className="btn-yellow-pill">
              Zum Kreditrechner ➔
            </a>
          </div>
        </div>

        {/* IMMOBILIENKREDIT */}
        <div className="credit-container">
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>Corus Immo: Erwecken Sie Ihr Immobilienprojekt zum Leben.</h2>
            <p>
              Expertenberatung und maßgeschneiderte Begleitung beim Kauf Ihres Haupt- oder Zweitwohnsitzes.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Immobilienlösungen entdecken ➔
            </a>
          </div>
          <div className="credit-image-box">
            <img src="/img/wohnhome.png" alt="Corus Immo" />
          </div>
        </div>
      </section>

      {/* ABSCHNITT AKTUELLES */}
      <section className="news-section">
        <div className="news-container">
          
          <div className="news-header">
            <div className="news-accent-line"></div>
            <h2 className="news-title">Was gibt es Neues?</h2>
          </div>

          <div className="news-grid">
            {/* KARTE 1 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-costs.avif" alt="Fixkosten senken" />
              </div>
              <div className="news-content">
                <h3>Budget optimieren</h3>
                <p>Entdecken Sie unsere praktischen Tipps zur effektiven Identifizierung und Reduzierung Ihrer monatlichen Ausgaben.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Mehr Informationen</a>
              </div>
            </div>

            {/* KARTE 2 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-banking.jpg" alt="Online-Banking" />
              </div>
              <div className="news-content">
                <h3>Die CorusApp</h3>
                <p>Steuern Sie alle Ihre Konten im Handumdrehen dank unserer sicheren mobilen Lösung.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Mehr Informationen</a>
              </div> 
            </div>

            {/* KARTE 3 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-money.avif" alt="Finanzielle Stabilität" />
              </div>
              <div className="news-content">
                <h3>Langfristige Stabilität</h3>
                <p>Warum der Aufbau einer soliden Sparstrategie der Schlüssel zu einer entspannten Zukunft ist.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Mehr Informationen</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ABSCHNITT ZUSÄTZLICHE DIENSTE */}
      <section className="ing-services-section">
        <div className="ing-services-container">
          
          <div className="ing-services-image-box">
            <img src="/img/Bank99_Handy_alpha-blk_mitBadge.jpg" alt="CorusBank auf dem Smartphone" />
          </div>

          <div className="ing-services-content">
            <div className="ing-accent-line"></div>
            <h2>Immer verbunden.<br />Immer an Ihrer Seite.</h2>
            
            <div className="ing-text-block">
              <h3>Benötigen Sie eine persönliche Beratung?</h3>
              <p>
                Unsere Finanzberater beantworten alle Ihre Fragen und begleiten Sie bei Ihren Schritten. Alle nützlichen Informationen finden Sie <a href="#" className="ing-link">hier</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}