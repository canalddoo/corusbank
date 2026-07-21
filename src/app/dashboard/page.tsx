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
          
          // Calculation of existing expenses (Approved transfers)
          const approvedTransfers = data.transfers || [];
          const expensesSum = approvedTransfers
            .filter((t: any) => t.status === "Approuvé" || t.status === "Approved")
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
          setTotalExpenses(expensesSum);

          // Calculation of income sum (Admin deposits)
          const historyDeposits = data.deposits || [];
          const incomesSum = historyDeposits.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
          setTotalIncomes(incomesSum);
        }
      } catch (err) {
        console.error("Error refreshing home balance:", err);
      }
    };
    fetchFreshBalance();
  }, []);

  // Determine balance to display (API balance prioritized, otherwise context balance)
  const currentBalance = liveBalance !== null ? liveBalance : (user?.balance ?? 0);

  return (
    <div className="corus-view-wrapper">
      
      {/* USER GREETING BLOCK */}
      <section className="corus-user-hero-card desktop-only">
        <div className="hero-profile-avatar">
          <div className="avatar-placeholder"><i className="fa-regular fa-user"></i></div>
        </div>
        <div className="hero-search-area">
          <h1>Hello, {user ? `${user.firstname} ${user.lastname}` : "Dear Customer"}</h1>
          <div className="hero-input-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search for an account, transfer, option..." />
          </div>
        </div> 
      </section>

      {/* MAIN INTERFACE ADAPTIVE GRID */}
      <div className="corus-dashboard-grid">
        
        {/* LEFT COMPONENT: CORUS ACCOUNT DETAILS */}
        <div className="corus-card-panel">
          <div className="panel-inner-padding"> 
            
            {/* Credit Card Header Box */} 
            <div className="credit-card-info-box">
              <div className="mock-card-graphic">
                <div className="yellow-stripe-mini"></div>
              </div>
              <div className="card-text-details">
                <p className="account-type-label">Corus Account / {user ? `${user.firstname} ${user.lastname}` : ""}</p>
                <strong className="account-iban-code">{user?.iban || "Loading..."}</strong>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="timeframe-selector-row">
              <span>Timeframe: <strong>Last 30 days</strong></span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Dynamic Income Gauge */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Income / Deposits</span>
                <span className="val-bold text-green">
                  +{totalIncomes.toLocaleString("en-US", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-green" 
                  style={{ width: totalIncomes > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Expense Gauge */}
            <div className="gauge-financial-container">
              <div className="gauge-text-metric">
                <span className="lbl-muted">Expenses / Outgoings</span>
                <span className="val-bold text-red">
                  -{totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              <div className="gauge-track">
                <div 
                  className="gauge-fill bg-red" 
                  style={{ width: totalExpenses > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Financial summary block connected to live balance */}
            <div className="financial-breakdown-summary">
              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Difference</span>
                <span className="val-dark">
                  {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
              
              <div className="breakdown-item flex-row structural-highlight">
                <span className="lbl-muted">Current account balance</span>
                <span className="val-large text-green">
                  {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>

              <div className="breakdown-item flex-row">
                <span className="lbl-muted">Available amount</span>
                <span className="val-small text-green-light">
                  {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} EUR
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COMPONENT: SHORTCUT MENU */}
        <div className="corus-card-panel no-padding-mobile">
          <div className="gray-header-strip-title">CorusBank Space</div>
          
          <div className="action-navigation-list">
            <Link href="/dashboard/finance" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Loan application</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
         
            <Link href="/dashboard/virement" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Make a transfer</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/dashboard/cartes" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>My Bank Cards</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link> 

            <Link href="/dashboard/details" className="action-list-row-item-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div className="action-list-row-item">
                <span>Account details</span>
                <i className="fa-solid fa-chevron-right text-muted"></i>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}