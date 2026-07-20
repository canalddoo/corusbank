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
          
          // Berechnen der Ausgaben (Genehmigte Überweisungen)
          const approvedTransfers = data.transfers || [];
          const expensesSum = approvedTransfers
            .filter((t: any) => t.status === "Approuvé" || t.status === "Genehmigt")
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
          setTotalExpenses(expensesSum);

          // Berechnen der Einnahmen
          const historyDeposits = data.deposits || [];
          const incomesSum = historyDeposits.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
          setTotalIncomes(incomesSum);
        }
      } catch (err) {
        console.error("Fehler beim Aktualisieren des Kontostands:", err);
      }
    };
    fetchFreshBalance();
  }, []);

  // Ermittlung des anzuzeigenden Kontostands
  const currentBalance = liveBalance !== null ? liveBalance : (user?.balance ?? 0);

  return (
    <div className="corus-view-wrapper">
      
      {/* BENUTZER-BEGRÜSSUNGSBEREICH */}
      <section className="corus-user-hero-card desktop-only">
        <div className="hero-profile-avatar">
          <div className="avatar-placeholder"><i className="fa-regular fa-user"></i></div>
        </div>
        <div className="hero-search-area">
          <h1>Guten Tag, {user ? `${user.firstname} ${user.lastname}` : "Sehr geehrter Kunde"}</h1>
          <div className="hero-input-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Konto, Überweisung, Option suchen..." />
          </div>
        </div> 
      </section>

      {/* RASTER DES HAUPTDASHBOARDS */}
      <div className="corus-dashboard-grid">
        
        {/* LINKER BEREICH: KONTODETAILS CORUS ACCOUNT */}
        <div className="corus-card-panel">
          <div className="panel-inner-padding"> 
            
            {/* Header Kreditkarten-Optik */} 
            <div className="credit-card-info-box">
              <div className="mock-card-graphic">
                <div className="yellow-stripe-mini"></div>
              </div>
              <div className="card-text-details">
                <p className="account-type-label">Corus Account / {user ? `${user.firstname} ${user.lastname}` : ""}</p>
                <strong className="account-iban-code">{user?.iban || "Wird geladen..."}</strong>
              </div>
            </div>

            {/* Zeitraumpicker */}
            <div className="timeframe-selector-row">
              <span>Zeitraum: <strong>Die letzten 30 Tage</strong></span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Anzeige Einnahmen */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Einnahmen / Zuflüsse</span>
                <span className="val-bold text-green">
                  +{totalIncomes.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-green" 
                  style={{ width: totalIncomes > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Anzeige Ausgaben */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Ausgaben / Abflüsse</span>
                <span className="val-bold text-red">
                  -{totalExpenses.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-red" 
                  style={{ width: totalExpenses > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Finanzübersicht */}
            <div className="financial-breakdown-summary">
              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Differenz</span>
                <span className="val-dark">
                  {currentBalance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              
              <div className="breakdown-item flex-row structural-highlight">
                <span className="lbl-muted">Aktueller Kontostand</span>
                <span className="val-large text-green">
                  {currentBalance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>

              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Verfügbarer Betrag</span>
                <span className="val-small text-green-light">
                  {currentBalance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* RECHTER BEREICH: SCHNELLZUGRIFFS-MENÜ */}
        <div className="corus-card-panel no-padding-mobile">
          <div className="gray-header-strip-title">CorusBank Bereich</div>
          
          <div className="action-navigation-list">
            <Link href="/de/dashboard/finance" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Kreditanfrage</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
         
            <Link href="/de/dashboard/virement" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Überweisung tätigen</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/de/dashboard/cartes" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Meine Bankkarten</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/de/dashboard/details" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Kontodetails</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}