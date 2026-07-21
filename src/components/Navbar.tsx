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

  // Determine current language based on the URL
  const getCurrentLang = () => {
    if (pathname.startsWith("/de")) return "DE";
    if (pathname.startsWith("/nl")) return "NL";
    return "EN"; // Default to English (main page)
  };

  const currentLang = getCurrentLang();

  // Function to switch language while preserving current page path
  const handleLanguageChange = (targetLang: string) => {
    setIsOpen(false);
    setActiveDropdown(null);

    // Clean current path from language prefixes
    let cleanPath = pathname;
    if (cleanPath.startsWith("/de")) {
      cleanPath = cleanPath.replace(/^\/de/, "");
    } else if (cleanPath.startsWith("/nl")) {
      cleanPath = cleanPath.replace(/^\/nl/, "");
    }

    // Ensure leading slash if path becomes empty
    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }

    // Build new URL
    let newPath = cleanPath;
    if (targetLang === "DE") {
      newPath = `/de${cleanPath === "/" ? "" : cleanPath}`;
    } else if (targetLang === "NL") {
      newPath = `/nl${cleanPath === "/" ? "" : cleanPath}`;
    }
    // If targetLang === "EN", newPath remains cleanPath

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
        
        {/* HEADER BAR */}
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

        {/* NAVIGATION MENU */}
        <div className={`nav-content ${isOpen ? "open" : ""}`}>
          
          <ul className="nav-links">
            {/* LINK 1 : ACCOUNTS */}
            <li className={`has-dropdown ${activeDropdown === "Compte" ? "active" : ""}`}>
              <a href="/dashboard" onClick={(e) => toggleDropdown("Compte", e)}>
                <span>Account</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Checking Account</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Student Account</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Bank Cards</Link></li>
              </ul>
            </li>

            {/* LINK 2 : FINANCE */}
            <li className={`has-dropdown ${activeDropdown === "Finance" ? "active" : ""}`}>
              <a href="/dashboard" onClick={(e) => toggleDropdown("Finance", e)}>
                <span>Finance</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Personal Loan</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Mortgage Financing</Link></li>
              </ul>
            </li>

            {/* LINK 3 : INVEST */}
            <li className={`has-dropdown ${activeDropdown === "Investir" ? "active" : ""}`}>
              <a href="#" onClick={(e) => toggleDropdown("Investir", e)}>
                <span>Invest</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link href="#" onClick={() => setIsOpen(false)}>Stocks & ETFs</Link></li>
                <li><Link href="#" onClick={() => setIsOpen(false)}>Investment Funds</Link></li>
              </ul>
            </li>

            {/* LINK 4 : ABOUT US */}
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                <span>About us</span>
                <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
              </Link>
            </li>
          </ul>

          {/* ACTION BUTTONS & LANGUAGE SELECTOR */}
          <div className="nav-buttons-container">
            <div className="nav-buttons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              
              {/* BUTTON: BECOME A CLIENT */}
              <div className={`has-dropdown btn-dropdown-wrapper ${activeDropdown === "DevenezClient" ? "active" : ""}`}>
                <button className="btn-yellow" onClick={(e) => toggleDropdown("DevenezClient", e)}>
                  <span>Become a client</span>
                  <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                  <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
                </button>
                
                <ul className="dropdown-menu button-dropdown">
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>CorusBank Account</strong>
                      <p>Banking services tailored to you. Personalized, simple, and transparent.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <strong>Corus Flex Savings</strong>
                      <p>Save with total flexibility and daily access to your funds.</p>
                    </Link>
                  </li>
                  
                  {/* INVESTMENTS SUB-MENU */}
                  <li className={`has-sub-dropdown ${activeSubDropdown === "OuvrirCompteOptions" ? "sub-active" : ""}`}>
                    <a href="#" onClick={(e) => toggleSubDropdown("OuvrirCompteOptions", e)} className="sub-dropdown-trigger">
                      <div>
                        <strong>Corus Investments</strong>
                        <p>Access financial markets through our brokerage space.</p>
                      </div>
                      <i className="fa-solid fa-chevron-right arrow-mobile-only"></i>
                    </a>
                    
                    <ul className="sub-dropdown-menu">
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Classic Brokerage Account
                        </Link>
                      </li>
                      <li>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Automated Investment Plans
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>CorusCredit Personal Loan</strong>
                      <p>Bring your projects to life with a tailored consumer loan.</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      <strong>Corus Real Estate Savings</strong>
                      <p>Prepare your real estate future step by step with peace of mind.</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* BUTTON: LOG IN */}
              <Link href="/login" className="btn-outline" onClick={() => setIsOpen(false)}>
                Log in 
                <i className="fa-solid fa-chevron-down chevron-pc-only"></i>
                <i className="fa-solid fa-arrow-right arrow-btn-mobile-only"></i>
              </Link>

              {/* LANGUAGE SELECTOR (EN, DE, NL) */}
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