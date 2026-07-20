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
  const [activeTab, setActiveTab] = useState<"Achat" | "Restructuration">("Achat");
  const [achatValue, setAchatValue] = useState(322000);
  const [detteValue, setDetteValue] = useState(87200); 
  const [duree, setDuree] = useState(10);
  const [isFixe, setIsFixe] = useState(true);
  const [history, setHistory] = useState<LoanHistoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [raison, setRaison] = useState("");
  const [emailContact, setEmailContact] = useState("");

  // E-Mail-Adresse automatisch vorausfüllen
  useEffect(() => {
    if (user?.email) {
      setEmailContact(user.email);
    }
  }, [user]);

  const loanAmount = activeTab === "Achat" ? achatValue * 0.85 : detteValue; 
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
      console.error("Fehler im Verlauf:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReasonModal = () => {
    if (activeTab === "Restructuration") {
      setRaison("Laufende Umschuldung / Schuldenumstrukturierung");
    } else {
      setRaison("");
    }
    setShowModal(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raison.trim()) return alert("Bitte geben Sie den Grund für Ihre Finanzierung an.");
    if (!emailContact.trim()) return alert("Bitte geben Sie eine gültige Kontakt-E-Mail-Adresse an.");

    setSubmitting(true);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          purchasePrice: activeTab === "Achat" ? achatValue : null,
          loanAmount: loanAmount,
          duration: duree,
          interestType: isFixe ? "Fix" : "Variabel",
          monthlyPayment: monthlyPayment,
          reason: raison,
          contactEmail: emailContact,
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
        alert("Beim Senden ist ein Fehler aufgetreten.");
        setSubmitting(false);
      }
    } catch (err) {
      alert("Netzwerkfehler.");
      setSubmitting(false);
    }
  };

  return (
    <div className="b99-view-wrapper" style={{ position: "relative" }}>
      
      {/* MODAL 1: ZUSÄTZLICHE ANGABEN */}
      {showModal && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface">
            {!submitting ? (
              <form onSubmit={handleFinalSubmit} className="b99-form-gap">
                <h3>Details zur Anfrage</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Aus welchem Hauptgrund beantragen Sie diese Finanzierung über{" "}
                  <strong>{loanAmount.toLocaleString("de-DE")} €</strong>?
                </p>
                
                <div className="simulator-input-group" style={{ marginBottom: "12px" }}>
                  <label style={{ marginBottom: "6px", display: "block" }}>Grund der Finanzierung</label>
                  <textarea
                    rows={3}
                    placeholder="z. B. Kauf eines Hauptwohnsitzes oder Kapitalanlage..."
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="simulator-input-group">
                  <label style={{ marginBottom: "6px", display: "block" }}>E-Mail-Adresse für die Nachverfolgung</label>
                  <input
                    type="email"
                    placeholder="ihre.email@beispiel.com"
                    value={emailContact}
                    onChange={(e) => setEmailContact(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="finance-action-buttons" style={{ marginTop: "20px" }}>
                  <button type="submit" className="primary-action-yellow-btn">
                    Anfrage bestätigen
                  </button>
                  <button type="button" className="outline-action-dark-btn" onClick={() => setShowModal(false)}>
                    Abbrechen
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div className="b99-spinner-loader"></div>
                <h4 style={{ marginTop: "20px" }}>Ihre Unterlagen werden verarbeitet...</h4>
                <p style={{ color: "#777", fontSize: "13px" }}>Überprüfung der Corus Immo Förderkriterien</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: ERFOLG */}
      {showSuccess && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface" style={{ textAlign: "center", padding: "35px" }}>
            <div style={{ width: "60px", height: "60px", background: "#e6f7ed", color: "#2e7d32", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", fontSize: "24px" }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>Anfrage erfolgreich übermittelt!</h3>
            <p style={{ color: "#555", fontSize: "14px", margin: "10px 0 25px 0", lineHeight: "1.5" }}>
              Ihr Kreditantrag wurde erfolgreich übermittelt. Ein Berater wird Sie innerhalb von 48 Stunden unter der angegebenen E-Mail-Adresse kontaktieren.
            </p>
            <button className="primary-action-yellow-btn" style={{ width: "100%" }} onClick={() => setShowSuccess(false)}>
              Schließen und zum Rechner zurückkehren
            </button>
          </div>
        </div>
      )}

      {/* BANNER */}
      <div className="b99-finance-banner">
        <h2>Unser Corus Immo Immobilienkredit</h2>
        <p>
          Hallo <strong>{user?.firstname}</strong>, beantragen Sie einen Kredit zwischen 50.000 € und 1.000.000 € für Ihre Projekte.
        </p>
      </div>

      <div className="b99-finance-split-layout">
        {/* LINKER BLOCK: RECHNER */}
        <div className="b99-card-panel">
          <div className="b99-simulator-tabs">
            <button 
              className={`tab-trigger ${activeTab === "Achat" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Achat")}
            >
              Immobilienkauf
            </button>
            <button 
              className={`tab-trigger ${activeTab === "Restructuration" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Restructuration")}
            >
              <i className="fa-solid fa-arrows-rotate"></i> Umschuldung
            </button>
          </div>

          <div className="panel-inner-padding b99-form-gap">
            {activeTab === "Achat" ? (
              <div className="simulator-input-group">
                <div className="simulator-label-row">
                  <label>Ursprünglicher Kaufpreis</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={achatValue.toLocaleString("de-DE")} 
                      onChange={(e) => setAchatValue(Number(e.target.value.replace(/\s/g, "").replace(/\./g, "")) || 0)}
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
                  <label>Umschuldungsbetrag</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={detteValue.toLocaleString("de-DE")} 
                      onChange={(e) => setDetteValue(Number(e.target.value.replace(/\s/g, "").replace(/\./g, "")) || 0)}
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
              <label className="input-section-title">Zinsart</label>
              <div className="toggle-grid-selection">
                <button className={`choice-button ${isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(true)}>Fester Zinssatz</button>
                <button className={`choice-button ${!isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(false)}>Variabler Zinssatz</button>
              </div>
            </div>

            <div className="simulator-input-group">
              <label className="input-section-title">Laufzeit (in Jahren)</label>
              <div className="years-grid-selection">
                {[5, 10, 15, 20].map((year) => (
                  <button key={year} className={`year-cell-button ${duree === year ? "selected-brand-yellow" : ""}`} onClick={() => setDuree(year)}>{year} Jahre</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RECHTER BLOCK: ERGEBNISSE */}
        <div className="b99-card-panel b99-result-flex-panel">
          <div className="panel-inner-padding flex-column-grow">
            <h3>Ihr Ergebnis</h3>
            <div className="result-metrics-stack">
              <div className="metric-row-line">
                <span>Finanzierungsbetrag</span>
                <strong className="loan-amount-bold">{loanAmount.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Gesamtrückzahlungsbetrag</span>
                <strong>{totalDue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Zinssatz</span>
                <strong>{isFixe ? "4,04 % Sollzins p.a." : "3,50 % variabel p.a."}</strong>
              </div>
            </div>

            <hr className="dashed-separator-line" />

            <div className="monthly-display-block">
              <span className="monthly-badge-label">Monatliche Rate</span>
              <h2>{monthlyPayment.toLocaleString("de-DE", { maximumFractionDigits: 2 })} €</h2>
            </div>

            <div className="finance-action-buttons">
              <button className="primary-action-yellow-btn" onClick={handleOpenReasonModal}>
                Finanzierung beantragen <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANFRAGEVERLAUF */}
      <div className="b99-card-panel" style={{ marginTop: "24px" }}>
        <div className="gray-header-strip-title">Verlauf Ihrer Finanzierungsanfragen</div>
        <div className="panel-inner-padding">
          {history.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", padding: "20px 0" }}>Derzeit liegen keine Anfragen vor.</p>
          ) : (
            <div className="action-navigation-list">
              {history.map((loan) => (
                <div key={loan.id} className="action-list-row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ flex: 1, paddingRight: "15px" }}>
                    <strong>Finanzierungsanfrage</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>Eingereicht am {new Date(loan.createdAt).toLocaleDateString("de-DE")}</div>
                    
                    {loan.reason && (
                      <div style={{ fontSize: "13px", color: "#555", marginTop: "6px", fontStyle: "italic", background: "#f9f9f9", padding: "4px 10px", borderRadius: "4px", display: "inline-block", borderLeft: "3px solid #ffcc00" }}>
                        Grund: {loan.reason}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", marginRight: "20px" }}>
                    <strong>{loan.loanAmount.toLocaleString("de-DE")} €</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>{loan.duration} Jahre — {loan.monthlyPayment.toLocaleString("de-DE", { maximumFractionDigits: 2 })} €/Monat</div>
                  </div>
                  <div>
                    <span className="badge-status text-muted" style={{ fontWeight: "bold", padding: "4px 8px", background: "#f5f5f5", borderRadius: "4px" }}>
                      {loan.status === "En attente" ? "⏳ In Bearbeitung" : loan.status === "Approuvé" ? "✅ Genehmigt" : loan.status}
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