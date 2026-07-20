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
    title: "Start uw droomhuisproject:",
    highlight: "CorusCredit",
    subtitle: "Droomt u ervan om huiseigenaar te worden? Onze hypotheek maakt het mogelijk.",
    buttonText: "Online leningcalculator",
    buttonLink: "/nl/calcul-pret",
    imageSrc: "/img/wohnhome.png"
  },
  {
    id: 2,
    title: "Beleg gedurende 6 maanden en ontvang tot € 90 bonus.",
    highlight: "",
    subtitle: "",
    warning: "Risicowaarschuwing: Beleggen in financiële instrumenten brengt risico's met zich mee, waaronder het mogelijke verlies van het ingelegde kapitaal.",
    buttonText: "Naar de actie",
    buttonLink: "#",
    imageSrc: "/img/ACERNITROGAMINGHEADSET.png"
  },
  {
    id: 3,
    title: "Voor al het andere heeft u nodig:",
    highlight: "CorusCredit",
    subtitle: "Van een nieuwe auto tot een renovatie: financier snel en eenvoudig alles wat u nodig heeft met CorusCredit.",
    buttonText: "Lening berekenen",
    buttonLink: "/nl/calcul-pret",
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
              {/* LINKS: TEKST */}
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

              {/* RECHTS: AFBEELDING */}
              <div className="hero-image-wrapper">
                <img src={slide.imageSrc} alt={slide.highlight || "Slide Asset"} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATIE */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Dia ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} aria-label="Volgende">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

      </div>
    </section>
  );
}