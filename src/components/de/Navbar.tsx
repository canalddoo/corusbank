"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Ermitteln der aktuellen Sprache basierend auf der URL
  const getCurrentLang = () => {
    if (pathname.startsWith("/de")) return "DE";
    if (pathname.startsWith("/nl")) return "NL";
    return "EN"; // Englisch als Standard
  };

  const currentLang = getCurrentLang();

  // Funktion zum Sprachwechsel bei Beibehaltung der aktuellen Seite
  const handleLanguageChange = (targetLang: string) => {
    setIsOpen(false);
    setActiveDropdown(null);

    // Sprachpräfixe aus dem aktuellen Pfad entfernen
    let cleanPath = pathname;
    if (cleanPath.startsWith("/de")) {
      cleanPath = cleanPath.replace(/^\/de/, "");
    } else if (cleanPath.startsWith("/nl")) {
      cleanPath = cleanPath.replace(/^\/nl/, "");
    }

    // Sicherstellen, dass ein Schrägstrich am Anfang steht
    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }

    // Neue URL erstellen
    let newPath = cleanPath;
    if (targetLang === "DE") {
      newPath = `/de${cleanPath === "/" ? "" : cleanPath}`;
    } else if (targetLang === "NL") {
      newPath = `/nl${cleanPath === "/" ? "" : cleanPath}`;
    }

    router.push(newPath || "/");
  };

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
        
        {/* HEADER-LEISTE */}
        <div className="nav-header">
          <div className="nav-brand">
            <Link href={currentLang === "DE" ? "/de" : currentLang === "NL" ? "/nl" : "/"}>
              <img src="/img/logo.png" alt="CorusBank Logo" style={{ cursor: "pointer" }} />
            </Link>
          </div>

          <button className="burger-menu" onClick={() => setIsOpen(!isOpen)} aria-label="Menü">
            <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>

        {/* DAS MENÜ */}
        <div className={`nav-content ${isOpen ? "open" : ""}`}>
          
          <ul className="nav-links">
            {/* LINK 1: KONTO */}
            <li className={`has-dropdown ${activeDropdown === "Compte" ? "active" : ""}`}>
              <a href="/de/dashboard" onClick={(e) => toggleDropdown("Compte", e)}>
                <span>Konto</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Girokonto</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Studentenkonto</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Bankkarten</Link></li>
              </ul>
            </li>

            {/* LINK 2: FINANZEN */}
            <li className={`has-dropdown ${activeDropdown === "Finance" ? "active" : ""}`}>
              <a href="/de/dashboard" onClick={(e) => toggleDropdown("Finance", e)}>
                <span>Finanzen</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Privatkredit</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Baufinanzierung</Link></li>
              </ul>
            </li>

            {/* LINK 3: ANLEGEN */}
            <li className={`has-dropdown ${activeDropdown === "Investir" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Investir", e)}>
                <span>Anlegen</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Aktien & ETFs</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Investmentfonds</Link></li>
              </ul>
            </li>

            {/* LINK 4: ÜBER UNS */}
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                <span>Über uns</span>
                <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
              </Link>
            </li>
          </ul>

          {/* BUTTONS UND SPRACHAWUSWAHL */}
          <div className="nav-buttons-container">
            <div className="nav-buttons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              
              {/* BUTTON KUNDE WERDEN */}
              <div className={`has-dropdown btn-dropdown-wrapper ${activeDropdown === "DevenezClient" ? "active" : ""}`}>
                <button className="btn-yellow" onClick={(e) => toggleDropdown("DevenezClient", e)}>
                  <span>Kunde werden</span>
                  <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                  <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
                </button>
                
                <ul className="dropdown-menu button-dropdown">
                  <li>
                    <Link href="/de/register" onClick={() => setIsOpen(false)}>
                      <strong>CorusBank Konto</strong>
                      <p>Banking nach Ihren Vorstellungen. Personalisierbar, einfach und transparent.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/de/register" onClick={() => setIsOpen(false)}>
                      <strong>Corus Flex Sparen</strong>
                      <p>Sparen Sie völlig flexibel mit täglichem Zugriff auf Ihr Geld.</p>
                    </Link>
                  </li>
                  
                  {/* UNTERMENÜ CAPITAL INVESTITIONEN */}
                  <li className={`has-sub-dropdown ${activeSubDropdown === "OuvrirCompteOptions" ? "sub-active" : ""}`}>
                    <a href="#" onClick={(e) => toggleSubDropdown("OuvrirCompteOptions", e)} className="sub-dropdown-trigger">
                      <div>
                        <strong>Corus Anlegen</strong>
                        <p>Steigen Sie mit unserem Depotbereich in die Finanzmärkte ein.</p>
                      </div>
                      <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
                    </a>
                    
                    <ul className="sub-dropdown-menu">
                      <li>
                        <Link href="/de/register" onClick={() => setIsOpen(false)}>
                          Klassisches Wertpapierdepot
                        </Link>
                      </li>
                      <li>
                        <Link href="/de/register" onClick={() => setIsOpen(false)}>
                          Wertpapiersparpläne
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>CorusCredit Ratenkredit</strong>
                      <p>Verwirklichen Sie Ihre Projekte mit einem maßgeschneiderten Verbraucherkredit.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>Corus Immo Sparen</strong>
                      <p>Bereiten Sie Ihre Immobilienzukunft Schritt für Schritt entspannt vor.</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* BUTTON ANMELDEN */}
              <Link href="/de/login" className="btn-outline" onClick={() => setIsOpen(false)}>
                Anmelden 
                <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
              </Link>

              {/* SPRACHAUSWAHL (EN, DE, NL) */}
              <div className={`has-dropdown btn-dropdown-wrapper ${activeDropdown === "Language" ? "active" : ""}`} style={{ marginLeft: "5px" }}>
                <button 
                  className="btn-outline" 
                  onClick={(e) => toggleDropdown("Language", e)}
                  style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="fa-solid fa-globe"></i>
                  <span>{currentLang}</span>
                  <i className="fa-solid fa-chevron-down chevron-pc-only" style={{ fontSize: "11px" }}></i>
                </button>

                <ul className="dropdown-menu" style={{ minWidth: "120px", right: 0, left: "auto" }}>
                  <li>
                    <button 
                      onClick={() => handleLanguageChange("EN")}
                      style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "8px 12px", cursor: "pointer", fontWeight: currentLang === "EN" ? "bold" : "normal" }}
                    >
                      🇬🇧 English
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleLanguageChange("DE")}
                      style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "8px 12px", cursor: "pointer", fontWeight: currentLang === "DE" ? "bold" : "normal" }}
                    >
                      🇩🇪 Deutsch
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleLanguageChange("NL")}
                      style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "8px 12px", cursor: "pointer", fontWeight: currentLang === "NL" ? "bold" : "normal" }}
                    >
                      🇳🇱 Nederlands
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}