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
    title: "Start uw droomhuisproject:",
    highlight: "Corus Immo",
    subtitle: "Droomt u ervan om huiseigenaar te worden? Onze hypothecaire lening maakt het mogelijk.",
    buttonText: "Online leningcalculator",
    buttonLink: "/nl/calcul-pret",
    imageSrc: "/img/wohnhome.png",
    imageAlt: "Droomhuisproject Corus Immo"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Automatische diashow elke 7 seconden
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

        {/* SLIDER CARDS WEERGAVE */}
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === current ? "active" : ""}`}
            >
              {/* LINKERKANT: TEKSTEN & KNOPPEN */}
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

              {/* RECHTERKANT: AFBEELDING + OPTIONELE BADGE */}
              <div className="hero-image-wrapper">
                {slide.badge && <div className="hero-badge">{slide.badge}</div>}
                <img src={slide.imageSrc} alt={slide.imageAlt} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* INLEIDINGSECTIE REKENMODULE */}
        <section className="calc-intro-section">
          <div className="calc-intro-container">
            <p className="calc-intro-text">
              Met onze lening <strong>Corus Immo</strong> kunt u tussen € 50.000 en € 1.000.000 lenen om de aankoop van uw ideale woning te financieren. U kunt kiezen voor een terugbetalingstermijn van 5 tot 35 jaar en verschillende renteopties: vast, variabel of gecombineerd.
            </p>
          </div>
        </section>

        {/* INTEGRATIE VAN DE LENINGCALCULATOR */}
        <LoanCalculator />

        {/* NAVIGATIE / STIPPEN ONDERAAN */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Ga naar dia ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={nextSlide} aria-label="Volgende dia">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

        {/* SECTIE ZOEKEN & ARTIKELEN */}
        <section className="news-section">
          <div className="news-container">
            
            <div className="news-header">
              <div className="news-accent-line"></div>
              <h2 className="news-title">Meer ontdekken...</h2>
            </div>

            <div className="news-grid">
              {/* KAART 1 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant1.avif" alt="Vastgoedfinanciering" />
                </div>
                <div className="news-content">
                  <h3>Vastgoedfinanciering</h3>
                  <p>Heeft u zich onlangs afgevraagd hoeveel geld u uw verhuurder verschuldigd bent?</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Meer informatie</a>
                </div>
              </div>

              {/* KAART 2 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant2.avif" alt="Schuldenherstructurering" />
                </div>
                <div className="news-content">
                  <h3>Schuldenherstructurering</h3>
                  <p>Wat zijn de belangrijkste factoren bij een herfinanciering? Hier zijn twee concrete voorbeelden.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Meer informatie</a>
                </div>
              </div>

              {/* KAART 3 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant3.avif" alt="Woningbouw" />
                </div>
                <div className="news-content">
                  <h3>Woningbouw</h3>
                  <p>Alles over het stimuleringspakket en subsidies voor vastgoedinvesteringen.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Meer informatie</a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTIE BEGELEIDING & LENINGEN */}
        <section className="credit-section">
          
          {/* PERSOONLIJK ADVIES */}
          <div className="credit-container">
            <div className="credit-image-box">
              <img src="/img/sofa.png" alt="CorusBank Advies" />
            </div>
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Onze prioriteit: Persoonlijk advies zonder voorwaarden.</h2>
              <p>
                U geniet tijdens het gehele adviesproces van begeleiding op maat. Wij staan voor u klaar per telefoon, via videoconsultatie of in een persoonlijk gesprek. Onze experts werken samen met u de ideale financieringsoplossing uit – zonder heronderhandelingen, zonder extra kosten met betrekking tot uw kredietwaardigheid en zonder verborgen kosten.
              </p>
              <a style={{textDecoration: "none"}} href="#calculateur" className="btn-yellow-pill">
                Naar de leningcalculator ➔
              </a>
            </div>
          </div>

          {/* HERINNERING LENINGAANBOD */}
          <div className="credit-container">
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Corus Immo: Start met de bouw van uw droomhuis.</h2>
              <p>
                Bij ons profiteert u van de beste marktvoorwaarden zonder verborgen kosten en van deskundig advies vanaf het eerste gesprek.
              </p>
              <a style={{textDecoration: "none"}} href="/nl/calcul-pret" className="btn-yellow-pill">
                Ontdek Corus Immo ➔
              </a>
            </div>
            <div className="credit-image-box">
              <img src="/img/wohnhome.png" alt="Corus Immo Aanbod" />
            </div>
          </div>

        </section>
      </div>
    </section>
  );
}