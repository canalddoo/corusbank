"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface LoanHistoryItem {
  id: number;
  type: string;
  loanAmount: number;
  duration: number;
  interestType: string;
  monthlyPayment: number;
  status: string;
  createdAt: string;
  reason?: string; 
}

export default function FinancePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"Purchase" | "Restructuring">("Purchase");
  const [achatValue, setAchatValue] = useState(322000);
  const [detteValue, setDetteValue] = useState(87200); 
  const [duree, setDuree] = useState(10);
  const [isFixe, setIsFixe] = useState(true);
  const [history, setHistory] = useState<LoanHistoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [raison, setRaison] = useState("");
  const [emailContact, setEmailContact] = useState(""); // State for follow-up email

  // Pre-set contact address with session email as soon as available
  useEffect(() => {
    if (user?.email) {
      setEmailContact(user.email);
    }
  }, [user]);

  const loanAmount = activeTab === "Purchase" ? achatValue * 0.85 : detteValue; 
  const totalDue = loanAmount * (1 + (isFixe ? 0.0404 : 0.035) * duree);
  const monthlyPayment = totalDue / (duree * 12);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/finance");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("History error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReasonModal = () => {
    if (activeTab === "Restructuring") {
      setRaison("Ongoing debt restructuring");
    } else {
      setRaison("");
    }
    setShowModal(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raison.trim()) return alert("Please state the reason for your financing.");
    if (!emailContact.trim()) return alert("Please enter a valid contact email.");

    setSubmitting(true);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          purchasePrice: activeTab === "Purchase" ? achatValue : null,
          loanAmount: loanAmount,
          duration: duree,
          interestType: isFixe ? "Fixed" : "Variable",
          monthlyPayment: monthlyPayment,
          reason: raison,
          contactEmail: emailContact, // <-- Sending renamed key matching schema
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          setSubmitting(false);
          setShowModal(false);
          setShowSuccess(true);
          fetchHistory();
        }, 2000);
      } else {
        alert("An error occurred during submission.");
        setSubmitting(false);
      }
    } catch (err) {
      alert("Network error.");
      setSubmitting(false);
    }
  };

  return (
    <div className="b99-view-wrapper" style={{ position: "relative" }}>
      
      {/* MODAL 1: ADDITIONAL CLARIFICATIONS */}
      {showModal && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface">
            {!submitting ? (
              <form onSubmit={handleFinalSubmit} className="b99-form-gap">
                <h3>Application Details</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  What is the main reason you are requesting this financing of{" "}
                  <strong>{loanAmount.toLocaleString("en-US")} €</strong> ?
                </p>
                
                <div className="simulator-input-group" style={{ marginBottom: "12px" }}>
                  <label style={{ marginBottom: "6px", display: "block" }}>Reason for financing</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Primary residence purchase or investment..."
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="simulator-input-group">
                  <label style={{ marginBottom: "6px", display: "block" }}>Email address for procedure follow-up</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={emailContact}
                    onChange={(e) => setEmailContact(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="finance-action-buttons" style={{ marginTop: "20px" }}>
                  <button type="submit" className="primary-action-yellow-btn">
                    Submit application
                  </button>
                  <button type="button" className="outline-action-dark-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div className="b99-spinner-loader"></div>
                <h4 style={{ marginTop: "20px" }}>Processing your application...</h4>
                <p style={{ color: "#777", fontSize: "13px" }}>Checking Corus Immo eligibility criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: SUCCESS DIALOG */}
      {showSuccess && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface" style={{ textAlign: "center", padding: "35px" }}>
            <div style={{ width: "60px", height: "60px", background: "#e6f7ed", color: "#2e7d32", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", fontSize: "24px" }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>Application Recorded!</h3>
            <p style={{ color: "#555", fontSize: "14px", margin: "10px 0 25px 0", lineHeight: "1.5" }}>
              Your loan application has been successfully submitted. An advisor will contact you at the provided email address within 48 hours.
            </p>
            <button className="primary-action-yellow-btn" style={{ width: "100%" }} onClick={() => setShowSuccess(false)}>
              Close and return to simulator
            </button>
          </div>
        </div>
      )}

      {/* PAGE HEADER BANNER */}
      <div className="b99-finance-banner">
        <h2>Our Corus Immo Mortgage Loan</h2>
        <p>
          Hello <strong>{user?.firstname}</strong>, apply for a loan between €50,000 and €1,000,000 for your projects.
        </p>
      </div>

      <div className="b99-finance-split-layout">
        {/* LEFT BLOCK: FORM */}
        <div className="b99-card-panel">
          <div className="b99-simulator-tabs">
            <button 
              className={`tab-trigger ${activeTab === "Purchase" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Purchase")}
            >
              Property Purchase
            </button>
            <button 
              className={`tab-trigger ${activeTab === "Restructuring" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Restructuring")}
            >
              <i className="fa-solid fa-arrows-rotate"></i> Debt Restructuring
            </button>
          </div>

          <div className="panel-inner-padding b99-form-gap">
            {activeTab === "Purchase" ? (
              <div className="simulator-input-group">
                <div className="simulator-label-row">
                  <label>Initial purchase price</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={achatValue.toLocaleString("en-US")} 
                      onChange={(e) => setAchatValue(Number(e.target.value.replace(/\s/g, "").replace(/,/g, "")) || 0)}
                    />
                  </div>
                </div>
                <input 
                  type="range" min="57000" max="2000000" step="1000"
                  value={achatValue} onChange={(e) => setAchatValue(Number(e.target.value))}
                  className="b99-custom-range-slider"
                />
              </div>
            ) : (
              <div className="simulator-input-group">
                <div className="simulator-label-row">
                  <label>Restructuring amount</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={detteValue.toLocaleString("en-US")} 
                      onChange={(e) => setDetteValue(Number(e.target.value.replace(/\s/g, "").replace(/,/g, "")) || 0)}
                    />
                  </div>
                </div>
                <input 
                  type="range" min="45200" max="172200" step="100"
                  value={detteValue} onChange={(e) => setDetteValue(Number(e.target.value))}
                  className="b99-custom-range-slider"
                />
              </div>
            )}

            <div className="simulator-input-group">
              <label className="input-section-title">Interest Type</label>
              <div className="toggle-grid-selection">
                <button className={`choice-button ${isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(true)}>Fixed rate</button>
                <button className={`choice-button ${!isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(false)}>Variable rate</button>
              </div>
            </div>

            <div className="simulator-input-group">
              <label className="input-section-title">Duration (in years)</label>
              <div className="years-grid-selection">
                {[5, 10, 15, 20].map((year) => (
                  <button key={year} className={`year-cell-button ${duree === year ? "selected-brand-yellow" : ""}`} onClick={() => setDuree(year)}>{year} years</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BLOCK: RESULTS */}
        <div className="b99-card-panel b99-result-flex-panel">
          <div className="panel-inner-padding flex-column-grow">
            <h3>Your Result</h3>
            <div className="result-metrics-stack">
              <div className="metric-row-line">
                <span>Financing amount</span>
                <strong className="loan-amount-bold">{loanAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Total amount due</span>
                <strong>{totalDue.toLocaleString("en-US", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Interest type</span>
                <strong>{isFixe ? "4.04% nominal p.a." : "3.50% variable p.a."}</strong>
              </div>
            </div>

            <hr className="dashed-separator-line" />

            <div className="monthly-display-block">
              <span className="monthly-badge-label">Monthly payment</span>
              <h2>{monthlyPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} €</h2>
            </div>

            <div className="finance-action-buttons">
              <button className="primary-action-yellow-btn" onClick={handleOpenReasonModal}>
                Apply for this financing <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION HISTORY SECTION */}
      <div className="b99-card-panel" style={{ marginTop: "24px" }}>
        <div className="gray-header-strip-title">Financing Application History</div>
        <div className="panel-inner-padding">
          {history.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", padding: "20px 0" }}>No applications recorded at this time.</p>
          ) : (
            <div className="action-navigation-list">
              {history.map((loan) => (
                <div key={loan.id} className="action-list-row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ flex: 1, paddingRight: "15px" }}>
                    <strong>Financing Application</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>Submitted on {new Date(loan.createdAt).toLocaleDateString("en-US")}</div>
                    
                    {loan.reason && (
                      <div style={{ fontSize: "13px", color: "#555", marginTop: "6px", fontStyle: "italic", background: "#f9f9f9", padding: "4px 10px", borderRadius: "4px", display: "inline-block", borderLeft: "3px solid #ffcc00" }}>
                        Reason: {loan.reason}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", marginRight: "20px" }}>
                    <strong>{loan.loanAmount.toLocaleString("en-US")} €</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>{loan.duration} years — {loan.monthlyPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} €/month</div>
                  </div>
                  <div>
                    <span className="badge-status text-muted" style={{ fontWeight: "bold", padding: "4px 8px", background: "#f5f5f5", borderRadius: "4px" }}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}