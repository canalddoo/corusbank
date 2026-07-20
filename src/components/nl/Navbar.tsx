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

  // Bepaal de huidige taal op basis van de URL
  const getCurrentLang = () => {
    if (pathname.startsWith("/de")) return "DE";
    if (pathname.startsWith("/nl")) return "NL";
    return "EN"; // Engels als standaard (hoofdpagina)
  };

  const currentLang = getCurrentLang();

  // Functie om van taal te veranderen met behoud van de huidige pagina
  const handleLanguageChange = (targetLang: string) => {
    setIsOpen(false);
    setActiveDropdown(null);

    // Verwijder taalprefixes uit het huidige pad
    let cleanPath = pathname;
    if (cleanPath.startsWith("/de")) {
      cleanPath = cleanPath.replace(/^\/de/, "");
    } else if (cleanPath.startsWith("/nl")) {
      cleanPath = cleanPath.replace(/^\/nl/, "");
    }

    // Zorg voor een slash aan het begin als het pad leeg wordt
    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }

    // Bouw de nieuwe URL
    let newPath = cleanPath;
    if (targetLang === "DE") {
      newPath = `/de${cleanPath === "/" ? "" : cleanPath}`;
    } else if (targetLang === "NL") {
      newPath = `/nl${cleanPath === "/" ? "" : cleanPath}`;
    }
    // Als targetLang === "EN", blijft newPath cleanPath

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
        
        {/* BOVENSTE BALK */}
        <div className="nav-header">
          <div className="nav-brand">
            <Link href={currentLang === "DE" ? "/de" : currentLang === "NL" ? "/nl" : "/"}>
              <img src="/img/logo.png" alt="CorusBank Logo" style={{ cursor: "pointer" }} />
            </Link>
          </div>

          <button className="burger-menu" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>

        {/* HET MENU */}
        <div className={`nav-content ${isOpen ? "open" : ""}`}>
          
          <ul className="nav-links">
            {/* LINK 1 : REKENING */}
            <li className={`has-dropdown ${activeDropdown === "Compte" ? "active" : ""}`}>
              <a href="/nl/dashboard" onClick={(e) => toggleDropdown("Compte", e)}>
                <span>Rekening</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Betaalrekening</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Studentenrekening</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Bankkaarten</Link></li>
              </ul>
            </li>

            {/* LINK 2 : FINANCIËN */}
            <li className={`has-dropdown ${activeDropdown === "Finance" ? "active" : ""}`}>
              <a href="/nl/dashboard" onClick={(e) => toggleDropdown("Finance", e)}>
                <span>Financiën</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Persoonlijke lening</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Hypothecaire financiering</Link></li>
              </ul>
            </li>

            {/* LINK 3 : BELEGGEN */}
            <li className={`has-dropdown ${activeDropdown === "Investir" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Investir", e)}>
                <span>Beleggen</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Aandelen & ETF's</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Beleggingsfondsen</Link></li>
              </ul>
            </li>

            {/* LINK 4 : OVER ONS */}
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                <span>Over ons</span>
                <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
              </Link>
            </li>
          </ul>

          {/* ACTIEKNOPPEN EN TALEN */}
          <div className="nav-buttons-container">
            <div className="nav-buttons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              
              {/* KNOP KLANT WORDEN */}
              <div className={`has-dropdown btn-dropdown-wrapper ${activeDropdown === "DevenezClient" ? "active" : ""}`}>
                <button className="btn-yellow" onClick={(e) => toggleDropdown("DevenezClient", e)}>
                  <span>Klant worden</span>
                  <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                  <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
                </button>
                
                <ul className="dropdown-menu button-dropdown">
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>CorusBank Rekening</strong>
                      <p>Bankdiensten die bij u passen. Gepersonaliseerd, eenvoudig en transparant.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>Corus Flex Sparen</strong>
                      <p>Spaar in alle flexibiliteit met dagelijkse toegang tot uw geld.</p>
                    </Link>
                  </li>
                  
                  {/* SUBMENU BELEGGINGEN */}
                  <li className={`has-sub-dropdown ${activeSubDropdown === "OuvrirCompteOptions" ? "sub-active" : ""}`}>
                    <a href="#" onClick={(e) => toggleSubDropdown("OuvrirCompteOptions", e)} className="sub-dropdown-trigger">
                      <div>
                        <strong>Corus Beleggingen</strong>
                        <p>Stap in de wereld van de markten met onze beursomgeving.</p>
                      </div>
                      <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
                    </a>
                    
                    <ul className="sub-dropdown-menu">
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Klassieke beleggingsrekening
                        </Link>
                      </li>
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Periodieke beleggingsplannen
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>CorusCredit Krediet</strong>
                      <p>Realiseer uw projecten met een consumentenkrediet op maat.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>Corus Immo Sparen</strong>
                      <p>Bereid uw vastgoedtoekomst stap voor stap en in alle rust voor.</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* KNOP INLOGGEN */}
              <Link href="/nl/login" className="btn-outline" onClick={() => setIsOpen(false)}>
                Inloggen 
                <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
              </Link>

              {/* TAALSELECTOR (EN, DE, NL) */}
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