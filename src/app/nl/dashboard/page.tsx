"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const [liveBalance, setLiveBalance] = React.useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = React.useState<number>(0);
  const [totalIncomes, setTotalIncomes] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchFreshBalance = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setLiveBalance(data.user?.balance ?? 0.0);
          
          // Berekenen van uitgaven (Goedgekeurde overboekingen)
          const approvedTransfers = data.transfers || [];
          const expensesSum = approvedTransfers
            .filter((t: any) => t.status === "Approuvé" || t.status === "Genehmigt" || t.status === "Goedgekeurd")
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
          setTotalExpenses(expensesSum);

          // Berekenen van inkomsten
          const historyDeposits = data.deposits || [];
          const incomesSum = historyDeposits.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
          setTotalIncomes(incomesSum);
        }
      } catch (err) {
        console.error("Fout bij het bijwerken van het saldo:", err);
      }
    };
    fetchFreshBalance();
  }, []);

  // Bepalen van het te tonen saldo
  const currentBalance = liveBalance !== null ? liveBalance : (user?.balance ?? 0);

  return (
    <div className="corus-view-wrapper">
      
      {/* GEBRUIKER WELKOMSTSECTIE */}
      <section className="corus-user-hero-card desktop-only">
        <div className="hero-profile-avatar">
          <div className="avatar-placeholder"><i className="fa-regular fa-user"></i></div>
        </div>
        <div className="hero-search-area">
          <h1>Goedendag, {user ? `${user.firstname} ${user.lastname}` : "Beste klant"}</h1>
          <div className="hero-input-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Zoek rekening, overboeking, optie..." />
          </div>
        </div> 
      </section>

      {/* RASTER VAN HET HOOFDDASHBOARD */}
      <div className="corus-dashboard-grid">
        
        {/* LINKER GEDEELTE: REKENINGDETAILS CORUS ACCOUNT */}
        <div className="corus-card-panel">
          <div className="panel-inner-padding"> 
            
            {/* Header Betaalkaart-Look */} 
            <div className="credit-card-info-box">
              <div className="mock-card-graphic">
                <div className="yellow-stripe-mini"></div>
              </div>
              <div className="card-text-details">
                <p className="account-type-label">Corus Account / {user ? `${user.firstname} ${user.lastname}` : ""}</p>
                <strong className="account-iban-code">{user?.iban || "Laden..."}</strong>
              </div>
            </div>

            {/* Periode kiezer */}
            <div className="timeframe-selector-row">
              <span>Periode: <strong>De laatste 30 dagen</strong></span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Weergave Inkomsten */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Inkomsten / Instroom</span>
                <span className="val-bold text-green">
                  +{totalIncomes.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-green" 
                  style={{ width: totalIncomes > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Weergave Uitgaven */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Uitgaven / Uitstroom</span>
                <span className="val-bold text-red">
                  -{totalExpenses.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-red" 
                  style={{ width: totalExpenses > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Financieel Overzicht */}
            <div className="financial-breakdown-summary">
              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Verschil</span>
                <span className="val-dark">
                  {currentBalance.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              
              <div className="breakdown-item flex-row structural-highlight">
                <span className="lbl-muted">Huidig Saldo</span>
                <span className="val-large text-green">
                  {currentBalance.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>

              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Beschikbaar Bedrag</span>
                <span className="val-small text-green-light">
                  {currentBalance.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* RECHTER GEDEELTE: SNELLE TOEGANG MENU */}
        <div className="corus-card-panel no-padding-mobile">
          <div className="gray-header-strip-title">CorusBank Omgeving</div>
          
          <div className="action-navigation-list">
            <Link href="/nl/dashboard/finance" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Leningaanvraag</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
         
            <Link href="/nl/dashboard/virement" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Geld overboeken</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/nl/dashboard/cartes" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Mijn Betaalkaarten</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/nl/dashboard/details" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Rekeningdetails</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}