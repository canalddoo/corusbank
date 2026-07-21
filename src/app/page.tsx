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

      {/* SECTION: 3 GOOD REASONS */}
      <section className="reasons-section">
        <div className="reasons-container">
          
          <h2 className="reasons-main-title">
            3 good reasons to choose CorusBank
          </h2>

          {/* Desktop Grid / Mobile Horizontal Slider */}
          <div 
            className="reasons-grid" 
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            
            {/* CARD 1 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-location.avif" alt="Proximity" />
              </div>
              <div className="reason-content">
                <h3>Proximity</h3>
                <p>An extensive network of branches and partners to always be by your side.</p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-snap.avif" alt="Simplicity" />
              </div>
              <div className="reason-content">
                <h3>Simplicity</h3>
                <p>Our mission: making daily management of your finances seamless and accessible.</p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="reason-card">
              <div className="reason-image-box">
                <img src="/img/icon-affordable.avif" alt="Transparency" />
              </div>
              <div className="reason-content">
                <h3>Transparency</h3>
                <p>Clear pricing, competitive rates, and no hidden fees.</p>
              </div>
            </div>

          </div>

          {/* Mobile Dots Indicators */}
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

      {/* SECTION: LOANS */}
      <section className="credit-section">
        {/* PERSONAL LOAN */}
        <div className="credit-container">
          <div className="credit-image-box">
            <img src="/img/sofa.png" alt="CorusCredit Personal Loan" />
          </div>
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>CorusCredit: A fixed and transparent interest rate for your projects.</h2>
            <p>
              Benefit from optimal conditions throughout the entire duration of your loan and stay in control of your budget with no unexpected surprises.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Access the loan calculator ➔
            </a>
          </div>
        </div>

        {/* MORTGAGE */}
        <div className="credit-container">
          <div className="credit-content">
            <div className="credit-accent-line"></div>
            <h2>Corus Immo: Bring your real estate project to life.</h2>
            <p>
              Expert advice and tailored support for buying your primary or secondary home.
            </p>
            <a style={{textDecoration: "none"}} href='#' className="btn-yellow-pill">
              Discover our mortgage solutions ➔
            </a>
          </div>
          <div className="credit-image-box">
            <img src="/img/wohnhome.png" alt="Corus Immo" />
          </div>
        </div>
      </section>

      {/* SECTION: NEWS */}
      <section className="news-section">
        <div className="news-container">
          
          <div className="news-header">
            <div className="news-accent-line"></div>
            <h2 className="news-title">What's new?</h2>
          </div>

          <div className="news-grid">
            {/* CARD 1 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-costs.avif" alt="Reducing fixed costs" />
              </div>
              <div className="news-content">
                <h3>Optimize your budget</h3>
                <p>Discover our practical tips to effectively identify and reduce your monthly expenses.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Learn more</a>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-banking.jpg" alt="Online banking" />
              </div>
              <div className="news-content">
                <h3>The CorusApp</h3>
                <p>Manage all your accounts at a glance with our secure mobile app solution.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Learn more</a>
              </div> 
            </div>

            {/* CARD 3 */}
            <div className="news-card">
              <div className="news-image-box">
                <img src="/img/news-money.avif" alt="Financial stability" />
              </div>
              <div className="news-content">
                <h3>Long-term stability</h3>
                <p>Why building a solid savings strategy is key to a peaceful future.</p>
                <a style={{textDecoration: "none"}} href='#' className="btn-yellow-news">Learn more</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: ADDITIONAL SERVICES */}
      <section className="ing-services-section">
        <div className="ing-services-container">
          
          <div className="ing-services-image-box">
            <img src="/img/Bank99_Handy_alpha-blk_mitBadge.jpg" alt="CorusBank on smartphone" />
          </div>

          <div className="ing-services-content">
            <div className="ing-accent-line"></div>
            <h2>Always connected.<br />Always by your side.</h2>
            
            <div className="ing-text-block">
              <h3>Need personalized support?</h3>
              <p>
                Our financial advisors are here to answer all your questions and guide you every step of the way. All useful information is available <a href="#" className="ing-link">here</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}