"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TransferPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  
  // Zustände für das Überweisungsformular
  const [showModal, setShowModal] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  // Aktionszustände
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Zustand für die Anzeige des kritischen Fehlerfensters
  const [showCriticalError, setShowCriticalError] = useState<boolean>(false);

  const [history, setHistory] = useState<any[]>([]);

  // Benutzerguthaben und Verlauf von der API me abrufen
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
        console.error("Fehler beim Abrufen des Guthabens:", err);
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
      setErrorMessage(`Unzureichendes Guthaben für diese Überweisung. Ihr aktuelles Guthaben beträgt ${balance.toFixed(2)} €.`);
      return;
    }

    setProcessing(true);

    try {
      // Senden der Überweisungsanfrage an den Server
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaryName, iban, bic, amount: transferAmount }),
      });

      if (res.ok) {
        // Nach 3 Sekunden Loader ausblenden und Fehleranzeige einblenden
        setTimeout(() => {
          setProcessing(false);
          setShowCriticalError(true);
        }, 3000);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "Ein Fehler ist aufgetreten.");
        setProcessing(false);
      }
    } catch (err) {
      setErrorMessage("Verbindungsfehler mit dem Server.");
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
            <h2>Überweisungen & Transfers</h2>
            <p>Führen Sie Ihre SEPA- und internationalen Überweisungen sicher aus.</p>
          </div>
        </div>
      </div>

      {/* GUTHABEN-KARTE */}
      <div className="b99-balance-card">
        <span className="balance-label">Verfügbares Guthaben auf Ihrem Konto</span>
        {loadingBalance ? (
          <h1 className="balance-amount loading-text">Wird geladen...</h1>
        ) : (
          <h1 className="balance-amount">{balance.toFixed(2)} €</h1>
        )}
        <button 
          onClick={() => { setShowModal(true); setErrorMessage(null); setShowCriticalError(false); }} 
          className="primary-action-yellow-btn"
          disabled={loadingBalance}
        >
          📲 Überweisung tätigen
        </button>

        {/* ÜBERWEISUNGSVERLAUF */}
        <div className="b99-balance-card" style={{ marginTop: "30px", textAlign: "left", maxWidth: "100%" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Verlauf Ihrer Überweisungen</h3>
          {history.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>Derzeit liegen keine Überweisungen vor.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Empfänger</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Betrag</th>
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
                        -{t.amount.toFixed(2)} €
                      </td>
                      <td style={{ padding: "12px 10px", color: "#64748b" }}>
                        {new Date(t.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <span className={`b99-admin-status-select status-${t.status.toLowerCase()}`} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "500" }}>
                          {t.status === "En attente" || t.status === "In Bearbeitung" ? "⏳ In Bearbeitung" : t.status === "Approuvé" || t.status === "Bestätigt" ? "✅ Bestätigt" : "❌ Abgelehnt"}
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

      {/* FORMULAR MODAL */}
      {showModal && (
        <div className="b99-modal-overlay">
          <div className="b99-modal-content">
            
            {/* Kritische Fehlermeldung */}
            {showCriticalError ? (
              <div className="b99-critical-error-view">
                <div className="error-icon-circle">✕</div>
                <h3>Aktion erforderlich: Überweisung abgelehnt</h3>
                <p className="error-main-text">
                  Ihr Konto erfordert eine zusätzliche Identitätsprüfung oder eine administrative Aktualisierung, um ausgehende Überweisungen durchzuführen.
                </p>
                <div className="instruction-box">
                  Bitte kontaktieren Sie umgehend Ihren persönlichen <strong>Kundenbetreuer</strong>, um die Situation zu klären und diese Transaktion abzuschließen.
                </div>
                <button onClick={closeAllModals} className="error-close-action-btn">
                  Verstanden
                </button>
              </div>
            ) : processing ? (
              /* LADEBILDSCHIRM */
              <div className="modal-processing-view">
                <div className="b99-spinner-loader"></div>
                <h4>Überweisungsauftrag wird verarbeitet...</h4>
                <p>Überprüfung des kryptografischen Zugriffs und Sicherung der Mittel</p>
              </div>
            ) : (
              /* EINGABEFORMULAR */
              <>
                <div className="modal-header">
                  <h3>Neue SEPA-Überweisung</h3>
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
                    <label>Name des Empfängers</label>
                    <input 
                      type="text" 
                      placeholder="z. B. Max Mustermann" 
                      value={beneficiaryName} 
                      onChange={(e) => setBeneficiaryName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>IBAN des Empfängers</label>
                    <input 
                      type="text" 
                      placeholder="ATXX XXXX XXXX XXXX XXXX" 
                      value={iban} 
                      onChange={(e) => setIban(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>BIC / SWIFT</label>
                    <input 
                      type="text" 
                      placeholder="z. B. SPBAATWW" 
                      value={bic} 
                      onChange={(e) => setBic(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Betrag (€)</label>
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
                      Abbrechen
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Überweisung bestätigen
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