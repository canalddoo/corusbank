"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-links-grid">
          {/* Spalte HILFE & KONTAKT */}
          <div className="footer-col">
            <h3>CorusBank Support</h3>
            <ul>
              <li>
                <Link href="tel:+43190202">
                  <i className="fa-solid fa-phone icon-left"></i> +43190202
                </Link>
              </li>
              <li>
                <Link href="mailto:contact@corusbank.com">
                  <i className="fa-solid fa-envelope icon-left"></i> contact@corusbank.com
                </Link>
              </li>
              <li className="phone-line">
                <span>Mo - Fr: 8:00 bis 18:00 Uhr</span>
              </li>
              <li>
                <Link href="#">
                  <i className="fa-regular fa-circle-question icon-left"></i> FAQ & Standorte
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte SICHERHEIT */}
          <div className="footer-col">
            <h3>Sicherheit</h3>
            <ul>
              <li><Link href="#">Kartensperre</Link></li>
              <li><Link href="#">Datenschutz</Link></li>
              <li><Link href="#">Impressum & Rechtliches</Link></li>
            </ul>
          </div>

          {/* Spalte ÜBER UNS */}
          <div className="footer-col">
            <h3>CorusBank</h3>
            <ul>
              <li><Link href="#">Über uns</Link></li>
              <li><Link href="#">Karriere</Link></li>
              <li><Link href="#">Barrierefreiheit</Link></li>
            </ul>
          </div>
        </div>

        {/* NACH OBEN BUTTON */}
        <button 
          className="scroll-to-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          aria-label="Nach oben"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>

        {/* FOOTER UNTEN */}
        <div className="footer-bottom">
          <p style={{ fontSize: "12px", textAlign: "center", color: "#64748b", marginTop: "15px" }}>
            &copy; {new Date().getFullYear()} CorusBank AG. Alle Rechte vorbehalten.
          </p>
        </div>

      </div>
    </footer>
  );
}