"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  const toggleDropdown = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  const toggleSubDropdown = (subMenuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeSubDropdown === subMenuName) {
      setActiveSubDropdown(null);
    } else {
      setActiveSubDropdown(subMenuName);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* LE BANDEAU DU HAUT */}
        <div className="nav-header">
          <div className="nav-brand">
            <Link href="/">
              <img src="/img/logo.png" alt="CorusBank Logo" style={{ cursor: "pointer" }} />
            </Link>
          </div>

          {/* <div className="mobile-search">
            <i className="fa-solid fa-location-dot"></i>
            <span>Trouver une agence</span>
          </div> */}

          <button className="burger-menu" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>

        {/* LE MENU */}
        <div className={`nav-content ${isOpen ? "open" : ""}`}>
          
          <ul className="nav-links">
            {/* LIEN 1 : COMPTE */}
            <li className={`has-dropdown ${activeDropdown === "Compte" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Compte", e)}>
                <span>Compte</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Compte courant</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Compte étudiant</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Cartes bancaires</Link></li>
              </ul>
            </li>

            {/* LIEN 2 : SAUVEGARDER */}
            <li className={`has-dropdown ${activeDropdown === "Sauvegarder" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Sauvegarder", e)}>
                <span>Épargne</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Livret d'épargne Corus</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Épargne logement</Link></li>
              </ul>
            </li>

            {/* LIEN 3 : FINANCE */}
            <li className={`has-dropdown ${activeDropdown === "Finance" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Finance", e)}>
                <span>Finance</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Prêt personnel</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Financement immobilier</Link></li>
              </ul>
            </li>

            {/* LIEN 4 : INVESTIR */}
            <li className={`has-dropdown ${activeDropdown === "Investir" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Investir", e)}>
                <span>Investir</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Actions & ETF</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Fonds d'investissement</Link></li>
              </ul>
            </li>

            {/* LIEN 5 : BLOG */}
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                <span>Blog</span>
                <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
              </Link>
            </li>

            {/* LIEN 6 : À PROPOS */}
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                <span>À propos de nous</span>
                <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
              </Link>
            </li>
          </ul>

          {/* BOUTONS D'ACTION */}
          <div className="nav-buttons-container">
            <div className="nav-buttons">
              
              {/* BOUTON DEVENEZ CLIENT CORUSBANK */}
              <div className={`has-dropdown btn-dropdown-wrapper ${activeDropdown === "DevenezClient" ? "active" : ""}`}>
                <button className="btn-yellow" onClick={(e) => toggleDropdown("DevenezClient", e)}>
                  <span>Devenez client</span>
                  <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                  <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
                </button>
                
                <ul className="dropdown-menu button-dropdown">
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>Compte CorusBank</strong>
                      <p>Des services bancaires à votre image. Personnalisés, simples et transparents.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>Corus Flex Épargne</strong>
                      <p>Épargnez en toute flexibilité avec un accès quotidien à vos fonds.</p>
                    </Link>
                  </li>
                  
                  {/* SOUS-MENU INVESTISSEMENT */}
                  <li className={`has-sub-dropdown ${activeSubDropdown === "OuvrirCompteOptions" ? "sub-active" : ""}`}>
                    <a href="#" onClick={(e) => toggleSubDropdown("OuvrirCompteOptions", e)} className="sub-dropdown-trigger">
                      <div>
                        <strong>Investissements Corus</strong>
                        <p>Entrez dans le monde des marchés avec notre espace de courtage.</p>
                      </div>
                      <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
                    </a>
                    
                    <ul className="sub-dropdown-menu">
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Compte de courtage classique
                        </Link>
                      </li>
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Plans d'investissement programmés
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>CorusCredit Conso</strong>
                      <p>Réalisez vos projets avec un prêt à la consommation sur mesure.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>Corus Immo Épargne</strong>
                      <p>Préparez sereinement votre avenir immobilier pas à pas.</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* BOUTON SE CONNECTER */}
              <Link href="/login" className="btn-outline" onClick={() => setIsOpen(false)}>
                Se connecter 
                <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
              </Link>
              
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}