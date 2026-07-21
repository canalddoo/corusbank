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
    title: "Launch your dream home project:",
    highlight: "CorusCredit",
    subtitle: "Dreaming of owning a home? Our mortgage financing makes it possible.",
    buttonText: "Online loan calculator",
    buttonLink: "/calcul-pret",
    imageSrc: "/img/wohnhome.png"
  },
  {
    id: 2,
    title: "Invest for 6 months and receive up to a €90 bonus.",
    highlight: "",
    subtitle: "",
    warning: "Risk Warning: Investments in financial instruments involve risks, including the potential loss of the invested capital.",
    buttonText: "About the campaign",
    buttonLink: "#",
    imageSrc: "/img/ACERNITROGAMINGHEADSET.png"
  },
  {
    id: 3,
    title: "For everything else, you need:",
    highlight: "CorusCredit",
    subtitle: "From new cars to home renovations: finance everything you need quickly and easily with CorusCredit.",
    buttonText: "Calculate loan",
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
              {/* LEFT: TEXT CONTENT */}
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

              {/* RIGHT: IMAGE */}
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
          <button className="hero-next-arrow" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} aria-label="Next">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

      </div>
    </section>
  );
}