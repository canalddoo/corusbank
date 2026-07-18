"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Slide {
  id: number;
  title: string;
  highlight: string;
  subtitle: string;
  warning?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Lancez votre projet de maison de rêve :",
    highlight: "CorusCredit",
    subtitle: "Vous rêvez de devenir propriétaire ? Notre prêt immobilier vous le permet.",
    buttonText: "Calculateur de prêt en ligne",
    buttonLink: "/calcul-pret",
    imageSrc: "/img/wohnhome.png"
  },
  {
    id: 2,
    title: "Investissez pendant 6 mois et recevez jusqu'à 90 € de bonus.",
    highlight: "",
    subtitle: "",
    warning: "Avertissement relatif aux risques : Les investissements dans des instruments financiers comportent des risques, y compris la perte possible du capital investi.",
    buttonText: "Concernant la campagne",
    buttonLink: "#",
    imageSrc: "/img/ACERNITROGAMINGHEADSET.png"
  },
  {
    id: 3,
    title: "Pour tout le reste, vous avez besoin de :",
    highlight: "CorusCredit",
    subtitle: "Des voitures neuves aux rénovations : avec CorusCredit, financez tout ce dont vous avez besoin rapidement et facilement.",
    buttonText: "Calculer le prêt",
    buttonLink: "/calcul-pret",
    imageSrc: "/img/sofa.png"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div key={slide.id} className={`hero-slide ${index === current ? "active" : ""}`}>
              {/* GAUCHE : TEXTES */}
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

              {/* DROITE : IMAGE */}
              <div className="hero-image-wrapper">
                <img src={slide.imageSrc} alt={slide.highlight || "Slide Asset"} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} aria-label="Suivant">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

      </div>
    </section>
  );
}