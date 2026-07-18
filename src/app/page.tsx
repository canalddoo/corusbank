"use client";

import React, { useRef, useState } from 'react';
import Hero from '@/components/Hero';

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

      {/* SECTION : 3 BONNES RAISONS */}
      <section className="reasons-section">
        <div className="reasons-container">
          
          <h2 className="reasons-main-title">
            3 bonnes raisons de choisir CorusBank
          </h2>

          {/* Grille sur PC / Slider horizontal sur Mobile */}
          <div 
            className="reasons-grid" 
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            
            {/* CARTE 1 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-location.avif" alt="Proximité" />
              </div>
              <div className="reason-content">
                <h3>Proximité</h3>
                <p>Un réseau étendu d'agences et de partenaires pour être toujours à vos côtés.</p>
              </div>
            </div>

            {/* CARTE 2 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-snap.avif" alt="Simplicité" />
              </div>
              <div className="reason-content">
                <h3>Simplicité</h3>
                <p>Notre mission : rendre la gestion de vos finances plus fluide et accessible au quotidien.</p>
              </div>
            </div>

            {/* CARTE 3 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-affordable.avif" alt="Transparence" />
              </div>
              <div className="reason-content">
                <h3>Transparence</h3>
                <p>Des tarifs clairs, des taux compétitifs et aucun frais caché.</p>
              </div>
            </div>

          </div>

          {/* Indicateurs (Dots) - Uniquement visibles sur Mobile */}
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

      {/* SECTION CREDITS */}
      <section className="credit-section">
        {/* CRÉDIT CONSO */}
        <div className="credit-container">
          <div className="credit-image-box">
            <img src="/img/sofa.png" alt="CorusCredit Conso" />
          </div>
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>CorusCredit : Un taux d’intérêt fixe et transparent pour vos projets.</h2>
            <p>
              Bénéficiez de conditions optimales pour toute la durée de votre prêt et maîtrisez votre budget sans mauvaise surprise.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Accédez au calculateur de prêt ➔
            </a>
          </div>
        </div>

        {/* CRÉDIT IMMO */}
        <div className="credit-container">
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>Corus Immo : Donnez vie à votre projet immobilier.</h2>
            <p>
              Des conseils experts et un accompagnement sur mesure pour l'achat de votre résidence principale ou secondaire.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Découvrir nos solutions Immo ➔
            </a>
          </div>
          <div className="credit-image-box">
            <img src="/img/wohnhome.png" alt="Corus Immo" />
          </div>
        </div>
      </section>

      {/* SECTION ACTUALITÉS */}
      <section className="news-section">
        <div className="news-container">
          
          <div className="news-header">
            <div className="news-accent-line"></div>
            <h2 className="news-title">Quoi de neuf ?</h2>
          </div>

          <div className="news-grid">
            {/* CARTE 1 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-costs.avif" alt="Réduire les coûts fixes" />
              </div>
              <div className="news-content">
                <h3>Optimiser son budget</h3>
                <p>Découvrez nos conseils pratiques pour identifier et réduire efficacement vos charges mensuelles.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Plus d'informations</a>
              </div>
            </div>

            {/* CARTE 2 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-banking.jpg" alt="Banque en ligne" />
              </div>
              <div className="news-content">
                <h3>L'application CorusApp</h3>
                <p>Pilotez l'ensemble de vos comptes en un clin d'œil grâce à notre solution mobile sécurisée.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Plus d'informations</a>
              </div> 
            </div>

            {/* CARTE 3 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-money.avif" alt="Stabilité financière" />
              </div>
              <div className="news-content">
                <h3>Stabilité à long terme</h3>
                <p>Pourquoi construire une stratégie d'épargne solide est la clé d'un avenir serein.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Plus d'informations</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION SERVICES SUPPLEMETAIRES */}
      <section className="ing-services-section">
        <div className="ing-services-container">
          
          <div className="ing-services-image-box">
            <img src="/img/Bank99_Handy_alpha-blk_mitBadge.jpg" alt="CorusBank sur smartphone" />
          </div>

          <div className="ing-services-content">
            <div className="ing-accent-line"></div>
            <h2>Toujours connecté.<br />Toujours à vos côtés.</h2>
            
            <div className="ing-text-block">
              <h3>Besoin d'un accompagnement personnalisé ?</h3>
              <p>
                Nos conseillers financiers répondent à toutes vos questions et vous guident dans vos démarches. Toutes les informations utiles sont disponibles <a href="#" className="ing-link">ici</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}