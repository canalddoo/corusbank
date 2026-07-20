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
    title: "Starten Sie Ihr Traumhaus-Projekt:",
    highlight: "CorusCredit",
    subtitle: "Träumen Sie davon, Eigenheimbesitzer zu werden? Unser Immobilienkredit macht es möglich.",
    buttonText: "Online-Kreditrechner",
    buttonLink: "/de/calcul-pret",
    imageSrc: "/img/wohnhome.png"
  },
  {
    id: 2,
    title: "Investieren Sie 6 Monate lang und erhalten Sie bis zu 90 € Bonus.",
    highlight: "",
    subtitle: "",
    warning: "Risikohinweis: Investitionen in Finanzinstrumente bergen Risiken, einschließlich des möglichen Verlusts des eingesetzten Kapitals.",
    buttonText: "Zur Aktion",
    buttonLink: "#",
    imageSrc: "/img/ACERNITROGAMINGHEADSET.png"
  },
  {
    id: 3,
    title: "Für alles andere brauchen Sie:",
    highlight: "CorusCredit",
    subtitle: "Vom Neuwagen bis zur Renovierung: Finanzieren Sie mit CorusCredit schnell und einfach alles, was Sie brauchen.",
    buttonText: "Kredit berechnen",
    buttonLink: "/de/calcul-pret",
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
              {/* LINKS: TEXTE */}
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

              {/* RECHTS: BILD */}
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
                aria-label={`Folie ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} aria-label="Weiter">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

      </div>
    </section>
  );
}