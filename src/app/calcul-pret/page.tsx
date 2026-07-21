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
    title: "Start your dream home project:",
    highlight: "Corus Immo",
    subtitle: "Dreaming of homeownership? Our mortgage loan makes it possible.",
    buttonText: "Online loan calculator",
    buttonLink: "/calcul-pret",
    imageSrc: "/img/wohnhome.png",
    imageAlt: "Corus Immo dream home project"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto-scroll every 7 seconds
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

        {/* SLIDER CARDS DISPLAY */}
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === current ? "active" : ""}`}
            >
              {/* LEFT SIDE: TEXT & BUTTONS */}
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

              {/* RIGHT SIDE: IMAGE + OPTIONAL BADGE */}
              <div className="hero-image-wrapper">
                {slide.badge && <div className="hero-badge">{slide.badge}</div>}
                <img src={slide.imageSrc} alt={slide.imageAlt} className="hero-img" />
              </div>
            </div>
          ))}
        </div>

        {/* CALCULATOR INTRO SECTION */}
        <section className="calc-intro-section">
          <div className="calc-intro-container">
            <p className="calc-intro-text">
              Our <strong>Corus Immo</strong> mortgage allows you to borrow between €50,000 and €1,000,000 to finance 
              the purchase of your ideal property. You can select a repayment period ranging from 5 to 35 
              years and choose between fixed, variable, or hybrid interest rate options.
            </p>
          </div>
        </section>

        {/* LOAN CALCULATOR COMPONENT */}
        <LoanCalculator />

        {/* NAVIGATION / BOTTOM DOTS */}
        <div className="hero-navigation">
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button className="hero-next-arrow" onClick={nextSlide} aria-label="Next slide">
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

        {/* ARTICLES & INSIGHTS SECTION */}
        <section className="news-section">
          <div className="news-container">
            
            <div className="news-header">
              <div className="news-accent-line"></div>
              <h2 className="news-title">Find out more...</h2>
            </div>

            <div className="news-grid">
              {/* CARD 1 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant1.avif" alt="Mortgage financing" />
                </div>
                <div className="news-content">
                  <h3>Mortgage financing</h3>
                  <p>Have you recently asked yourself how much money you are paying to your landlord?</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Learn more</a>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant2.avif" alt="Debt restructuring" />
                </div>
                <div className="news-content">
                  <h3>Debt restructuring</h3>
                  <p>What are the key factors of refinancing? Here are two concrete examples.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Learn more</a>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="news-card">
                <div className="news-image-box">
                  <img src="/img/finant3.avif" alt="Home construction" />
                </div>
                <div className="news-content">
                  <h3>Home construction</h3>
                  <p>All about the economic stimulus plan and subsidies for real estate investment.</p>
                  <a style={{textDecoration: "none"}} href="#" className="btn-yellow-news">Learn more</a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ADVISORY & LOANS SECTION */}
        <section className="credit-section">
          
          {/* PERSONAL CONSULTATION */}
          <div className="credit-container">
            <div className="credit-image-box">
              <img src="/img/sofa.png" alt="CorusBank Consultation" />
            </div>
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Our priority: personalized consultation with zero commitments.</h2>
              <p>
                You will benefit from dedicated guidance throughout the consultation process. 
                We are available by phone, video call, or in person. 
                Our experts work with you to find the ideal financing solution—without renegotiation, extra creditworthiness fees, or hidden costs.
              </p>
              <a style={{textDecoration: "none"}} href="#calculateur" className="btn-yellow-pill">
                Access the loan calculator ➔
              </a>
            </div>
          </div>

          {/* LOAN OFFER REMINDER */}
          <div className="credit-container">
            <div className="credit-content">
              <div className="credit-accent-line"></div>
              <h2>Corus Immo: Start building your dream home today.</h2>
              <p>
                Enjoy market-leading conditions, absolute transparency with no hidden fees, and expert guidance right from your first consultation.
              </p>
              <a style={{textDecoration: "none"}} href="/calcul-pret" className="btn-yellow-pill">
                Discover Corus Immo ➔
              </a>
            </div>
            <div className="credit-image-box">
              <img src="/img/wohnhome.png" alt="Corus Immo Offer" />
            </div>
          </div>

        </section>
      </div>
    </section>
  );
}