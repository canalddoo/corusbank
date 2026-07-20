"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoanCalculator from "../components/LoanCalculator";

interface Slide {
  id: number;
  title: string;
  highlight: string;
  subtitle: string;
  warning?: string;
  badge?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Starten Sie Ihr Traumhaus-Projekt:",
    highlight: "Corus Immo",
    subtitle: "Träumen Sie davon, Eigenheimbesitzer zu werden? Unser Immobilienkredit macht es möglich.",
    buttonText: "Online-Kreditrechner",
    buttonLink: "/de/calcul-pret",
    imageSrc: "/img/wohnhome.png",
    imageAlt: "Traumhaus-Projekt Corus Immo"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Automatische Diashow alle 7 Sekunden
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);
 
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length); 
  };

  return (
    <section className="hero-section"> 
      <div className="hero-container">

        {/* SLIDER CARDS ANZEIGE */}
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === current ? "active" : ""}`}
            >
              {/* LINKE SEITE: TEXTE & BUTTONS */}
              <div className="hero-content">
                <h1 className="hero-title">
                  {slide.title} {slide.highlight && <span className="hero-highlight"><br/>{slide.highlight}</span>}
                </h1> 
                
                {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
                {slide.warning && <p className="hero-warning">{slide.warning}</p>}
                
                <Link href={slide.buttonLink} className="hero-btn">
                  {slide.buttonText} <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              {/* RECHTE SEITE: BILD + OPTIONALES BADGE */}
              <div className="hero-image-wrapper">
                {slide.badge && <div className="hero-badge">{slide.badge}</div>}
                <img src={slide.imageSrc} alt={slide.imageAlt} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* EINLEITUNGSABSCHNITT ZUM RECHNER */}
        <section className="calc-intro-section">
          <div className="calc-intro-container">
            <p className="calc-intro-text">
              Unser Kredit <strong>Corus Immo</strong> ermöglicht es Ihnen, zwischen 50.000 € und 1.000.000 € zu leihen, um den Erwerb Ihrer idealen Immobilie zu finanzieren. Sie können eine Rückzahlungsdauer von 5 bis 35 Jahren sowie verschiedene Zinssatzoptionen wählen: fest, variabel oder kombiniert.
            </p>
          </div>
        </section>

        {/* EINBINDUNG DES KREDITRECHNERS */}
        <LoanCalculator />

        {/* NAVIGATION / DOTS UNTEN */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Gehe zu Folie ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={nextSlide} aria-label="Nächste Folie">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

        {/* ABSCHNITT SUCHEN & ARTIKEL */}
        <section className="news-section">
          <div className="news-container">
            
            <div className="news-header">
              <div className="news-accent-line"></div>
              <h2 className="news-title">Mehr erfahren...</h2>
            </div>

            <div className="news-grid">
              {/* KARTE 1 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant1.avif" alt="Immobilienfinanzierung" />
                </div>
                <div className="news-content">
                  <h3>Immobilienfinanzierung</h3>
                  <p>Haben Sie sich vor Kurzem gefragt, wie viel Geld Sie Ihrem Vermieter schulden?</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Mehr Informationen</a>
                </div>
              </div>

              {/* KARTE 2 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant2.avif" alt="Schuldenumschichtung" />
                </div>
                <div className="news-content">
                  <h3>Schuldenumschichtung</h3>
                  <p>Was sind die Schlüsselfaktoren einer Umfinanzierung? Hier sind zwei konkrete Beispiele.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Mehr Informationen</a>
                </div>
              </div>

              {/* KARTE 3 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant3.avif" alt="Wohnungsbau" />
                </div>
                <div className="news-content">
                  <h3>Wohnungsbau</h3>
                  <p>Alles über das Konjunkturpaket und Förderungen für Immobilieninvestitionen.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Mehr Informationen</a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ABSCHNITT BEGLEITUNG & KREDITE */}
        <section className="credit-section">
          
          {/* PERSÖNLICHE BERATUNG */}
          <div className="credit-container">
            <div className="credit-image-box">
              <img src="/img/sofa.png" alt="CorusBank Beratung" />
            </div>
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Unsere Priorität: Eine persönliche Beratung ohne Bedingungen.</h2>
              <p>
                Sie profitieren während des gesamten Beratungsprozesses von einer maßgeschneiderten Begleitung. Wir stehen Ihnen telefonisch, per Videokonferenz oder persönlich zur Verfügung. Unsere Experten erarbeiten gemeinsam mit Ihnen die ideale Finanzierungslösung – ohne Nachverhandlungen, ohne Zusatzkosten bezüglich Ihrer Bonität und ohne versteckte Gebühren.
              </p>
              <a style={{textDecoration: "none"}} href="#calculateur" className="btn-yellow-pill">
                Zum Kreditrechner ➔
              </a>
            </div>
          </div>

          {/* ERINNERUNG KREDITANGEBOT */}
          <div className="credit-container">
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Corus Immo: Starten Sie den Bau Ihres Traumhauses.</h2>
              <p>
                Bei uns profitieren Sie von den besten Marktbedingungen ohne versteckte Kosten und von kompetenter Beratung ab dem ersten Gespräch.
              </p>
              <a style={{textDecoration: "none"}} href="/de/calcul-pret" className="btn-yellow-pill">
                Corus Immo entdecken ➔
              </a>
            </div>
            <div className="credit-image-box">
              <img src="/img/wohnhome.png" alt="Corus Immo Angebot" />
            </div>
          </div>

        </section>
      </div>
    </section>
  );
}