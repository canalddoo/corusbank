"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TransferPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  
  // États pour le formulaire de virement
  const [showModal, setShowModal] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  // États d'action
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Nouvel état pour l'affichage de la boîte d'erreur finale critique
  const [showCriticalError, setShowCriticalError] = useState<boolean>(false);

  const [history, setHistory] = useState<any[]>([]); //

  // Charger le solde de l'utilisateur depuis l'API me
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.user?.balance ?? 0.0);
        setHistory(data.transfers || []); // <-- Stocke l'historique ici
      }
    } catch (err) {
      console.error("Erreur récupération solde:", err);
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
      setErrorMessage(`Solde insuffisant pour effectuer ce virement. Votre solde actuel est de ${balance.toFixed(2)} €.`);
      return;
    }

    setProcessing(true);

    try {
      // Envoi de la demande de virement réelle au serveur
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaryName, iban, bic, amount: transferAmount }),
      });

      if (res.ok) {
        // Après 3 secondes, masquer le loader et afficher la fenêtre d'erreur/gestionnaire
        setTimeout(() => {
          setProcessing(false);
          setShowCriticalError(true);
        }, 3000);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "Une erreur est survenue.");
        setProcessing(false);
      }
    } catch (err) {
      setErrorMessage("Erreur de connexion avec le serveur.");
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
      {/* BANNIÈRE */}
      <div className="b99-finance-banner">
        <div className="banner-flex-row">
          <div>
            <h2>Virements & Transferts</h2>
            <p>Effectuez vos virements SEPA et internationaux de manière sécurisée.</p>
          </div>
          {/* <Link href="/dashboard" className="b99-details-back-btn">
            Retour au tableau de bord
          </Link> */}
        </div>
      </div>

      {/* ZONE SOLDE COMPTE */}
      <div className="b99-balance-card">
        <span className="balance-label">Solde disponible de votre compte</span>
        {loadingBalance ? (
          <h1 className="balance-amount loading-text">Chargement...</h1>
        ) : (
          <h1 className="balance-amount">{balance.toFixed(2)} €</h1>
        )}
        <button 
          onClick={() => { setShowModal(true); setErrorMessage(null); setShowCriticalError(false); }} 
          className="primary-action-yellow-btn"
          disabled={loadingBalance}
        >
          📲 Faire un virement
        </button>

        {/* ZONE HISTORIQUE DES VIREMENTS */}
      <div className="b99-balance-card" style={{ marginTop: "30px", textAlign: "left", maxWidth: "100%" }}>
        <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Historique de vos transferts</h3>
        {history.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px" }}>Aucun virement effectué pour le moment.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Bénéficiaire</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Montant</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Statut</th>
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
                      {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <span className={`b99-admin-status-select status-${t.status.toLowerCase()}`} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "500" }}>
                        {t.status === "En attente" ? "⏳ En attente" : t.status === "Approuvé" ? "✅ Confirmé" : "❌ Refusé"}
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

      {/* FORMULAIRE EN PREMIER PLAN (MODAL) */}
      {showModal && (
        <div className="b99-modal-overlay">
          <div className="b99-modal-content">
            
            {/* Affichage de l'erreur interbancaire critique après le loader */}
            {showCriticalError ? (
              <div className="b99-critical-error-view">
                <div className="error-icon-circle">✕</div>
                <h3>Action Requise : Virement Refusé</h3>
                <p className="error-main-text">
                  Votre compte nécessite une validation d'identité supplémentaire ou une mise à jour administrative pour initier des transferts sortants.
                </p>
                <div className="instruction-box">
                   Veuillez contacter immédiatement votre <strong>gestionnaire de compte</strong> attitré afin de régulariser la situation et finaliser cette transaction.
                </div>
                <button onClick={closeAllModals} className="error-close-action-btn">
                  Compris
                </button>
              </div>
            ) : processing ? (
              /* ÉCRAN DE TRAITEMENT AVEC LOADER */
              <div className="modal-processing-view">
                <div className="b99-spinner-loader"></div>
                <h4>Traitement de l'ordre de transfert en cours...</h4>
                <p>Vérification des accès cryptographiques et sécurisation des fonds</p>
              </div>
            ) : (
              /* FORMULAIRE DE SAISIE */
              <>
                <div className="modal-header">
                  <h3>Nouveau virement SEPA</h3>
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
                    <label>Nom du bénéficiaire</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jean Dupont" 
                      value={beneficiaryName} 
                      onChange={(e) => setBeneficiaryName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>IBAN du bénéficiaire</label>
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
                      placeholder="Ex: SPBAATWW" 
                      value={bic} 
                      onChange={(e) => setBic(e.target.value.toUpperCase())} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Montant (€)</label>
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
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Valider le virement
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