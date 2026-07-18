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
  const [emailContact, setEmailContact] = useState(""); // État pour l'email de suivi

  // Prorégler l'adresse de contact avec l'email de session dès qu'il est dispo
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
      console.error("Erreur historique:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReasonModal = () => {
    if (activeTab === "Restructuration") {
      setRaison("Restructuration de dettes en cours");
    } else {
      setRaison("");
    }
    setShowModal(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raison.trim()) return alert("Veuillez indiquer la raison de votre financement.");
    if (!emailContact.trim()) return alert("Veuillez renseigner un email de contact valide.");

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
          interestType: isFixe ? "Fixe" : "Variable",
          monthlyPayment: monthlyPayment,
          reason: raison,
          contactEmail: emailContact, // <-- Envoi de la clé renommée correspondante au schéma
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
        alert("Une erreur est survenue lors de l'envoi.");
        setSubmitting(false);
      }
    } catch (err) {
      alert("Erreur réseau.");
      setSubmitting(false);
    }
  };

  return (
    <div className="b99-view-wrapper" style={{ position: "relative" }}>
      
      {/* MODALE 1 : CLARIFICATIONS COMPLÉMENTAIRES */}
      {showModal && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface">
            {!submitting ? (
              <form onSubmit={handleFinalSubmit} className="b99-form-gap">
                <h3>Précision de la demande</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Pour quelle raison principale demandez-vous ce financement de{" "}
                  <strong>{loanAmount.toLocaleString("fr-FR")} €</strong> ?
                </p>
                
                <div className="simulator-input-group" style={{ marginBottom: "12px" }}>
                  <label style={{ marginBottom: "6px", display: "block" }}>Raison du financement</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Achat d'une résidence principale ou investissement..."
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="simulator-input-group">
                  <label style={{ marginBottom: "6px", display: "block" }}>Adresse e-mail pour le suivi des procédures</label>
                  <input
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={emailContact}
                    onChange={(e) => setEmailContact(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                    required
                  />
                </div>

                <div className="finance-action-buttons" style={{ marginTop: "20px" }}>
                  <button type="submit" className="primary-action-yellow-btn">
                    Valider la demande
                  </button>
                  <button type="button" className="outline-action-dark-btn" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div className="b99-spinner-loader"></div>
                <h4 style={{ marginTop: "20px" }}>Traitement de votre dossier...</h4>
                <p style={{ color: "#777", fontSize: "13px" }}>Vérification des critères d'éligibilité Corus Immo</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALE 2 : DIV DE SUCCÈS */}
      {showSuccess && (
        <div className="b99-overlay-backdrop">
          <div className="b99-modal-surface" style={{ textAlign: "center", padding: "35px" }}>
            <div style={{ width: "60px", height: "60px", background: "#e6f7ed", color: "#2e7d32", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", fontSize: "24px" }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>Demande enregistrée !</h3>
            <p style={{ color: "#555", fontSize: "14px", margin: "10px 0 25px 0", lineHeight: "1.5" }}>
              Votre demande de prêt a été transmise avec succès. Un conseiller prendra contact avec vous sur l'adresse email indiquée sous 48 heures.
            </p>
            <button className="primary-action-yellow-btn" style={{ width: "100%" }} onClick={() => setShowSuccess(false)}>
              Fermer et retourner au simulateur
            </button>
          </div>
        </div>
      )}

      {/* BANNIÈRE EN-TÊTE DE LA PAGE */}
      <div className="b99-finance-banner">
        <h2>Notre prêt immobilier Corus Immo</h2>
        <p>
          Bonjour <strong>{user?.firstname}</strong>, demandez un prêt entre 50 000 € et 1 000 000 € pour vos projets.
        </p>
      </div>

      <div className="b99-finance-split-layout">
        {/* BLOC DE GAUCHE : FORMULAIRE */}
        <div className="b99-card-panel">
          <div className="b99-simulator-tabs">
            <button 
              className={`tab-trigger ${activeTab === "Achat" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Achat")}
            >
              Achat immobilier
            </button>
            <button 
              className={`tab-trigger ${activeTab === "Restructuration" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Restructuration")}
            >
              <i className="fa-solid fa-arrows-rotate"></i> Restructuration de dettes
            </button>
          </div>

          <div className="panel-inner-padding b99-form-gap">
            {activeTab === "Achat" ? (
              <div className="simulator-input-group">
                <div className="simulator-label-row">
                  <label>Prix d'achat initial</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={achatValue.toLocaleString("fr-FR")} 
                      onChange={(e) => setAchatValue(Number(e.target.value.replace(/\s/g, "")) || 0)}
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
                  <label>Montant de la restructuration</label>
                  <div className="currency-box-input">
                    <span>€</span>
                    <input 
                      type="text" 
                      value={detteValue.toLocaleString("fr-FR")} 
                      onChange={(e) => setDetteValue(Number(e.target.value.replace(/\s/g, "")) || 0)}
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
              <label className="input-section-title">Type d'intérêt</label>
              <div className="toggle-grid-selection">
                <button className={`choice-button ${isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(true)}>Taux fixe</button>
                <button className={`choice-button ${!isFixe ? "selected-brand-yellow" : ""}`} onClick={() => setIsFixe(false)}>Taux variable</button>
              </div>
            </div>

            <div className="simulator-input-group">
              <label className="input-section-title">Durée (en années)</label>
              <div className="years-grid-selection">
                {[5, 10, 15, 20].map((year) => (
                  <button key={year} className={`year-cell-button ${duree === year ? "selected-brand-yellow" : ""}`} onClick={() => setDuree(year)}>{year} ans</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BLOC DE DROITE : RÉSULTATS */}
        <div className="b99-card-panel b99-result-flex-panel">
          <div className="panel-inner-padding flex-column-grow">
            <h3>Votre résultat</h3>
            <div className="result-metrics-stack">
              <div className="metric-row-line">
                <span>Montant du financement</span>
                <strong className="loan-amount-bold">{loanAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Montant total dû</span>
                <strong>{totalDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</strong>
              </div>
              <div className="metric-row-line">
                <span>Type d'intérêt</span>
                <strong>{isFixe ? "4,04 % nominal p.a." : "3,50 % variable p.a."}</strong>
              </div>
            </div>

            <hr className="dashed-separator-line" />

            <div className="monthly-display-block">
              <span className="monthly-badge-label">Mensualité</span>
              <h2>{monthlyPayment.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</h2>
            </div>

            <div className="finance-action-buttons">
              <button className="primary-action-yellow-btn" onClick={handleOpenReasonModal}>
                Demander ce financement <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION HISTORIQUE DES DEMANDES */}
      <div className="b99-card-panel" style={{ marginTop: "24px" }}>
        <div className="gray-header-strip-title">Historique de vos demandes de financement</div>
        <div className="panel-inner-padding">
          {history.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", padding: "20px 0" }}>Aucune demande enregistrée pour le moment.</p>
          ) : (
            <div className="action-navigation-list">
              {history.map((loan) => (
                <div key={loan.id} className="action-list-row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ flex: 1, paddingRight: "15px" }}>
                    <strong>Demande de financement</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>Déposé le {new Date(loan.createdAt).toLocaleDateString("fr-FR")}</div>
                    
                    {loan.reason && (
                      <div style={{ fontSize: "13px", color: "#555", marginTop: "6px", fontStyle: "italic", background: "#f9f9f9", padding: "4px 10px", borderRadius: "4px", display: "inline-block", borderLeft: "3px solid #ffcc00" }}>
                        Motif : {loan.reason}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", marginRight: "20px" }}>
                    <strong>{loan.loanAmount.toLocaleString("fr-FR")} €</strong>
                    <div style={{ fontSize: "12px", color: "#777" }}>{loan.duration} ans — {loan.monthlyPayment.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €/mois</div>
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