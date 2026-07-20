"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-links-grid">
          {/* Kolom HULP & CONTACT */}
          <div className="footer-col">
            <h3>CorusBank Ondersteuning</h3>
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
                <span>Ma - Vr: 8:00 tot 18:00 uur</span>
              </li>
              <li><Link href="#"><i className="fa-regular fa-circle-question icon-left"></i> Veelgestelde vragen & Locaties</Link></li>
            </ul>
          </div>

          {/* Kolom VEILIGHEID */}
          <div className="footer-col">
            <h3>Veiligheid</h3>
            <ul>
              <li><Link href="#">Kaart blokkeren</Link></li>
              <li><Link href="#">Gegevensbescherming</Link></li>
              <li><Link href="#">Juridische kennisgeving</Link></li>
            </ul>
          </div>

          {/* Kolom OVER ONS */}
          <div className="footer-col">
            <h3>CorusBank</h3>
            <ul>
              <li><Link href="#">Over ons</Link></li>
              <li><Link href="#">Carrières</Link></li>
              <li><Link href="#">Toegankelijkheid</Link></li>
            </ul>
          </div>
        </div>

        {/* KNOP TERUG NAAR BOVEN */}
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Terug naar boven">
          <i className="fa-solid fa-arrow-up"></i>
        </button>

        {/* ONDERKANT VAN DE FOOTER */}
        <div className="footer-bottom">
          <p style={{ fontSize: "12px", textAlign: "center", color: "#64748b", marginTop: "15px" }}>
            &copy; {new Date().getFullYear()} CorusBank AG. Alle rechten voorbehouden.
          </p>
        </div>

      </div>
    </footer>
  );
}