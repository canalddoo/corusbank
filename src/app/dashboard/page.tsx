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
          
          // Calcul des dépenses existantes (Virements approuvés)
          const approvedTransfers = data.transfers || [];
          const expensesSum = approvedTransfers
            .filter((t: any) => t.status === "Approuvé")
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
          setTotalExpenses(expensesSum);

          // Calcul de la somme des entrées d'argent (Ajouts admin)
          const historyDeposits = data.deposits || [];
          const incomesSum = historyDeposits.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
          setTotalIncomes(incomesSum);
        }
      } catch (err) {
        console.error("Erreur actualisation solde accueil:", err);
      }
    };
    fetchFreshBalance();
  }, []);

  // Détermination du solde à afficher (Solde API en priorité, sinon solde du contexte)
  const currentBalance = liveBalance !== null ? liveBalance : (user?.balance ?? 0);

  return (
    <div className="corus-view-wrapper">
      
      {/* BLOC SALUTATION UTILISATEUR */}
      <section className="corus-user-hero-card desktop-only">
        <div className="hero-profile-avatar">
          <div className="avatar-placeholder"><i className="fa-regular fa-user"></i></div>
        </div>
        <div className="hero-search-area">
          <h1>Bonjour, {user ? `${user.firstname} ${user.lastname}` : "Cher Client"}</h1>
          <div className="hero-input-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Rechercher un compte, un virement, une option..." />
          </div>
        </div> 
      </section>

      {/* GRILLE ADAPTATIVE DE L'INTERFACE PRINCIPALE */}
      <div className="corus-dashboard-grid">
        
        {/* COMPOSANT DE GAUCHE : DÉTAIL DU COMPTE CORUS ACCOUNT */}
        <div className="corus-card-panel">
          <div className="panel-inner-padding"> 
            
            {/* Boîtier Header de Carte de Crédit */} 
            <div className="credit-card-info-box">
              <div className="mock-card-graphic">
                <div className="yellow-stripe-mini"></div>
              </div>
              <div className="card-text-details">
                <p className="account-type-label">Corus Account / {user ? `${user.firstname} ${user.lastname}` : ""}</p>
                <strong className="account-iban-code">{user?.iban || "En cours de chargement..."}</strong>
              </div>
            </div>

            {/* Sélecteur de Période Temporelle */}
            <div className="timeframe-selector-row">
              <span>Période : <strong>Les 30 derniers jours</strong></span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Jauge d'Entrées d'Argent Dynamique */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Revenus / Entrées</span>
                <span className="val-bold text-green">
                  +{totalIncomes.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-green" 
                  style={{ width: totalIncomes > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Jauge de Sorties d'Argent */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Dépenses / Sorties</span>
                <span className="val-bold text-red">
                  -{totalExpenses.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-red" 
                  style={{ width: totalExpenses > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Bloc du résumé financier connecté au solde en temps réel */}
            <div className="financial-breakdown-summary">
              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Différence</span>
                <span className="val-dark">
                  {currentBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              
              <div className="breakdown-item flex-row structural-highlight">
                <span className="lbl-muted">Solde actuel du compte</span>
                <span className="val-large text-green">
                  {currentBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>

              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Montant disponible</span>
                <span className="val-small text-green-light">
                  {currentBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* COMPOSANT DE DROITE : MENU DE RACCOURCIS */}
        <div className="corus-card-panel no-padding-mobile">
          <div className="gray-header-strip-title">Espace CorusBank</div>
          
          <div className="action-navigation-list">
            <Link href="/dashboard/finance" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Demande de crédit</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
         
            <Link href="/dashboard/virement" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Effectuer un virement</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/dashboard/cartes" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Mes Cartes Bancaires</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/dashboard/details" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Détails du compte</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}