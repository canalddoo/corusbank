"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoanCalculator from "@/components/LoanCalculator";

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
    title: "Lancez votre projet de maison de rêve :",
    highlight: "Corus Immo",
    subtitle: "Vous rêvez de devenir propriétaire ? Notre prêt immobilier vous le permet.",
    buttonText: "Calculateur de prêt en ligne",
    buttonLink: "/calcul-pret",
    imageSrc: "/img/wohnhome.png",
    imageAlt: "Projet de maison de rêve Corus Immo"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Défilement automatique toutes les 7 secondes
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

        {/* AFFICHAGE DES CARDS DU SLIDER */}
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === current ? "active" : ""}`}
            >
              {/* CÔTÉ GAUCHE : TEXTES & BOUTONS */}
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

              {/* CÔTÉ DROIT : IMAGE + BADGE OPTIONNEL */}
              <div className="hero-image-wrapper">
                {slide.badge && <div className="hero-badge">{slide.badge}</div>}
                <img src={slide.imageSrc} alt={slide.imageAlt} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* SECTION D'INTRODUCTION AU CALCULATEUR */}
        <section className="calc-intro-section">
          <div className="calc-intro-container">
            <p className="calc-intro-text">
              Notre prêt <strong>Corus Immo</strong> vous permet d’emprunter entre 50 000 € et 1 000 000 € pour financer 
              l’acquisition de votre bien immobilier idéal. Vous pouvez choisir une durée de remboursement de 5 à 35 
              ans et différentes options de taux d’intérêt : fixe, variable ou mixte.
            </p>
          </div>
        </section>

        {/* INCLUSION DU CALCULATEUR DE PRÊT */}
        <LoanCalculator />

        {/* NAVIGATION / DOTS EN BAS */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={nextSlide} aria-label="Diapositive suivante">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

        {/* SECTION RECHERCHES & ARTICLES */}
        <section className="news-section">
          <div className="news-container">
            
            <div className="news-header">
              <div className="news-accent-line"></div>
              <h2 className="news-title">En savoir plus...</h2>
            </div>

            <div className="news-grid">
              {/* CARTE 1 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant1.avif" alt="Financement immobilier" />
                </div>
                <div className="news-content">
                  <h3>Financement immobilier</h3>
                  <p>Vous êtes-vous récemment demandé combien d'argent vous devez à votre propriétaire ?</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Plus d'informations</a>
                </div>
              </div>

              {/* CARTE 2 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant2.avif" alt="Restructuration de la dette" />
                </div>
                <div className="news-content">
                  <h3>Restructuration de la dette</h3>
                  <p>Quels sont les facteurs clés d'un refinancement ? Voici deux exemples concrets.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Plus d'informations</a>
                </div>
              </div>

              {/* CARTE 3 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant3.avif" alt="Construction de logement" />
                </div>
                <div className="news-content">
                  <h3>Construction de logement</h3>
                  <p>Tout sur le plan de relance économique et les aides à l'investissement immobilier.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Plus d'informations</a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION ACCOMPAGNEMENT & CREDITS */}
        <section className="credit-section">
          
          {/* CONSULTATION PERSO */}
          <div className="credit-container">
            <div className="credit-image-box">
              <img src="/img/sofa.png" alt="Consultation CorusBank" />
            </div>
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Notre priorité : une consultation personnalisée sans conditions.</h2>
              <p>
                Vous bénéficierez d'un accompagnement personnalisé tout au long du processus de consultation. 
                Nous sommes à votre disposition par téléphone, en visioconférence ou en personne.
                Nos experts travaillent avec vous pour trouver la solution de financement idéale, sans renégociation, sans frais supplémentaires liés à votre solvabilité et sans coûts cachés.
              </p>
              <a style={{textDecoration: "none"}} href="#calculateur" className="btn-yellow-pill">
                Accédez au calculateur de prêt ➔
              </a>
            </div>
          </div>

          {/* RAPPEL OFFRE DE PRÊT */}
          <div className="credit-container">
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Corus Immo : Lancez la construction de votre maison de rêve.</h2>
              <p>
                Avec nous, vous bénéficiez des meilleures conditions du marché, sans aucun frais caché, et de conseils compétents dès la première consultation.
              </p>
              <a style={{textDecoration: "none"}} href="/calcul-pret" className="btn-yellow-pill">
                Découvrir Corus Immo ➔
              </a>
            </div>
            <div className="credit-image-box">
              <img src="/img/wohnhome.png" alt="Offre Corus Immo" />
            </div>
          </div>

        </section>
      </div>
    </section>
  );
}