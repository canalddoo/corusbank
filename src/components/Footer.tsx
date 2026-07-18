"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-links-grid">
          {/* Colonne AIDE & CONTACT */}
          <div className="footer-col">
            <h3>Support CorusBank</h3>
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
                <span>Lun - Ven : 8h à 18h</span>
              </li>
              <li><Link href="#"><i className="fa-regular fa-circle-question icon-left"></i> FAQ & Lieux</Link></li>
            </ul>
          </div>

          {/* Colonne SÉCURITÉ */}
          <div className="footer-col">
            <h3>Sécurité</h3>
            <ul>
              <li><Link href="#">Blocage de carte</Link></li>
              <li><Link href="#">Protection des données</Link></li>
              <li><Link href="#">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Colonne À PROPOS */}
          <div className="footer-col">
            <h3>CorusBank</h3>
            <ul>
              <li><Link href="#">À propos de nous</Link></li>
              <li><Link href="#">Carrières</Link></li>
              <li><Link href="#">Accessibilité</Link></li>
            </ul>
          </div>
        </div>

        {/* BOUTON RETOUR EN HAUT */}
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Retour en haut">
          <i className="fa-solid fa-arrow-up"></i>
        </button>

        {/* BAS DU FOOTER */}
        <div className="footer-bottom" >
          
          <p style={{ fontSize: "12px", textAlign:"center", color: "#64748b", marginTop: "15px" }}>
            &copy; {new Date().getFullYear()} CorusBank AG. Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
}