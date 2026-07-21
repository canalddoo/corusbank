"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TransferPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  
  // Transfer form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  // Action states
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // New state for displaying the final critical error box
  const [showCriticalError, setShowCriticalError] = useState<boolean>(false);

  const [history, setHistory] = useState<any[]>([]);

  // Load user balance from the /api/auth/me API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.user?.balance ?? 0.0);
          setHistory(data.transfers || []); // Store history here
        }
      } catch (err) {
        console.error("Error retrieving balance:", err);
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
      setErrorMessage(`Insufficient balance to complete this transfer. Your current balance is €${balance.toFixed(2)}.`);
      return;
    }

    setProcessing(true);

    try {
      // Send actual transfer request to the server
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaryName, iban, bic, amount: transferAmount }),
      });

      if (res.ok) {
        // After 3 seconds, hide the loader and display the error/account manager window
        setTimeout(() => {
          setProcessing(false);
          setShowCriticalError(true);
        }, 3000);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "An error occurred.");
        setProcessing(false);
      }
    } catch (err) {
      setErrorMessage("Connection error with the server.");
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
            <h2>Transfers & Wire Payments</h2>
            <p>Make your SEPA and international wire transfers securely.</p>
          </div>
          {/* <Link href="/dashboard" className="b99-details-back-btn">
            Back to Dashboard
          </Link> */}
        </div>
      </div>

      {/* ACCOUNT BALANCE AREA */}
      <div className="b99-balance-card">
        <span className="balance-label">Available balance in your account</span>
        {loadingBalance ? (
          <h1 className="balance-amount loading-text">Loading...</h1>
        ) : (
          <h1 className="balance-amount">€{balance.toFixed(2)}</h1>
        )}
        <button 
          onClick={() => { setShowModal(true); setErrorMessage(null); setShowCriticalError(false); }} 
          className="primary-action-yellow-btn"
          disabled={loadingBalance}
        >
          📲 Make a transfer
        </button>

        {/* TRANSFER HISTORY AREA */}
        <div className="b99-balance-card" style={{ marginTop: "30px", textAlign: "left", maxWidth: "100%" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Transfer history</h3>
          {history.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>No transfers made yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Beneficiary</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
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
                        -€{t.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 10px", color: "#64748b" }}>
                        {new Date(t.createdAt).toLocaleDateString("en-US")}
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <span className={`b99-admin-status-select status-${t.status.toLowerCase()}`} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "500" }}>
                          {t.status === "En attente" ? "⏳ Pending" : t.status === "Approuvé" ? "✅ Confirmed" : "❌ Declined"}
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

      {/* FOREGROUND FORM (MODAL) */}
      {showModal && (
        <div className="b99-modal-overlay">
          <div className="b99-modal-content">
            
            {/* Display critical interbank error after loader */}
            {showCriticalError ? (
              <div className="b99-critical-error-view">
                <div className="error-icon-circle">✕</div>
                <h3>Action Required: Transfer Declined</h3>
                <p className="error-main-text">
                  Your account requires additional identity verification or an administrative update to initiate outgoing transfers.
                </p>
                <div className="instruction-box">
                   Please immediately contact your assigned <strong>account manager</strong> to regularize the situation and complete this transaction.
                </div>
                <button onClick={closeAllModals} className="error-close-action-btn">
                  Understood
                </button>
              </div>
            ) : processing ? (
              /* PROCESSING SCREEN WITH LOADER */
              <div className="modal-processing-view">
                <div className="b99-spinner-loader"></div>
                <h4>Processing transfer order...</h4>
                <p>Verifying cryptographic access and securing funds</p>
              </div>
            ) : (
              /* ENTRY FORM */
              <>
                <div className="modal-header">
                  <h3>New SEPA Transfer</h3>
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
                    <label>Beneficiary name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={beneficiaryName} 
                      onChange={(e) => setBeneficiaryName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Beneficiary IBAN</label>
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
                      placeholder="e.g. SPBAATWW" 
                      value={bic} 
                      onChange={(e) => setBic(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount (€)</label>
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
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Confirm transfer
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