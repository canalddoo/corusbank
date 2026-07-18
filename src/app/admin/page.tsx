"use client";

import React, { useState } from "react";

interface LoanAdminItem {
  id: number;
  userEmail: string;
  contactEmail: string;
  type: string;
  loanAmount: number;
  duration: number;
  interestType: string;
  monthlyPayment: number;
  status: string;
  reason?: string;
  createdAt: string;
}

interface UserAdminItem {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  balance: number | null;
}

interface TransferAdminItem {
  id: number;
  userEmail: string;
  beneficiaryName: string;
  iban: string;
  bic: string;
  amount: number;
  status: string;
  createdAt: string;
}



export default function AdminFinancePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"loans" | "balances" | "transfers">("loans");
const [allTransfers, setAllTransfers] = useState<TransferAdminItem[]>([]);
const [updatingTransferId, setUpdatingTransferId] = useState<number | null>(null);
  
  const [allLoans, setAllLoans] = useState<LoanAdminItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserAdminItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [balanceInputs, setBalanceInputs] = useState<{ [key: string]: string }>({});
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const [updatingLoanId, setUpdatingLoanId] = useState<number | null>(null);

  const fetchAdminData = async (token: string) => {
    const res = await fetch("/api/admin/finance", {
      method: "GET",
      headers: { Authorization: `Basic ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setAllLoans(data.loans || []);
      setAllUsers(data.users || []);
      setAllTransfers(data.transfers || []); // Stocke les transferts
      setIsAdmin(true);
    } else {
      setError("Identifiants de sécurité incorrects.");
    }
  };

  const handleUpdateTransferStatus = async (transferId: number, newStatus: string) => {
    setUpdatingTransferId(transferId);
    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          intent: "update_transfer_status",
          transferId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        await fetchAdminData(token);
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors du traitement du virement.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    } finally {
      setUpdatingTransferId(null);
    }
  };
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = btoa(`${username}:${password}`);
    try {
      await fetchAdminData(token);
    } catch (err) {
      setError("Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (email: string, action: "add" | "set") => {
    const inputVal = balanceInputs[email];
    if (!inputVal || isNaN(Number(inputVal))) {
      alert("Veuillez entrer un montant numérique valide.");
      return;
    }

    setUpdatingEmail(email);
    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          intent: "update_balance",
          email,
          amount: Number(inputVal),
          action,
        }),
      });

      if (res.ok) {
        await fetchAdminData(token);
        setBalanceInputs((prev) => ({ ...prev, [email]: "" }));
      } else {
        alert("Erreur serveur lors de la mise à jour du solde.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    } finally {
      setUpdatingEmail(null);
    }
  };

  const handleUpdateStatus = async (loanId: number, newStatus: string) => {
    setUpdatingLoanId(loanId);
    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          intent: "update_loan_status",
          loanId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        await fetchAdminData(token);
      } else {
        alert("Erreur lors de la modification du statut.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    } finally {
      setUpdatingLoanId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="b99-admin-login-container">
        <div className="b99-admin-login-card">
          <div className="b99-admin-login-header">
            <h2>Espace d'Administration</h2>
            <p>Veuillez vous authentifier pour voir les dossiers</p>
          </div>
          <form onSubmit={handleAdminLogin} className="b99-admin-form">
            {error && <div className="b99-admin-error-box">{error}</div>}
            <div className="b99-admin-input-group">
              <label>Identifiant</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="b99-admin-input-group">
              <label>Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="b99-admin-btn-primary" disabled={loading}>
              {loading ? "Vérification..." : "Se connecter"}
            </button>
          </form>
          
        </div>
      </div>
    );
  }

  return (
    <div className="b99-admin-dashboard-wrapper">
      <div className="b99-admin-top-banner">
        <div className="b99-admin-title-area">
          <h2>Panneau d'Administration Général</h2>
          <p>Supervisez les requêtes de financement et gérez les portefeuilles des comptes.</p>
        </div>
        <button className="b99-admin-btn-logout" onClick={() => { setIsAdmin(false); setPassword(""); }}>
          Déconnexion
        </button>
      </div>

      <div className="b99-admin-tabs-nav">
        <button 
          className={`b99-admin-tab-btn ${activeTab === "loans" ? "active" : ""}`} 
          onClick={() => setActiveTab("loans")}
        >
          📂 Demandes de Prêts ({allLoans.length})
        </button>
        <button 
          className={`b99-admin-tab-btn ${activeTab === "balances" ? "active" : ""}`} 
          onClick={() => setActiveTab("balances")}
        >
          💳 Solde des Utilisateurs ({allUsers.length})
        </button>
        <button 
          className={`b99-admin-tab-btn ${activeTab === "transfers" ? "active" : ""}`} 
          onClick={() => setActiveTab("transfers")}
        >
          📲 Demandes de Virements ({allTransfers.length})
        </button>
      </div>

      <div className="b99-admin-content-card">
        {activeTab === "loans" ? (
          <>
            <div className="b99-admin-card-header">Tous les dossiers clients reçus</div>
            <div className="b99-admin-card-body">
              {allLoans.length === 0 ? (
                <p className="b99-admin-empty-state">Aucun dossier en base de données.</p>
              ) : (
                <div className="b99-admin-loans-list">
                  {allLoans.map((loan) => (
                    <div key={loan.id} className="b99-admin-loan-row">
                      <div className="b99-admin-loan-main-info">
                        <div className="b99-admin-badge-row">
                          <span className="b99-admin-id-badge">ID: {loan.id}</span>
                          <strong className="b99-admin-loan-type">
                            {loan.type === "Achat" ? "🏠 Achat Immobilier" : "🔄 Restructuration"}
                          </strong>
                        </div>
                        <div className="b99-admin-emails-container" style={{ margin: "8px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div className="b99-admin-client-email" style={{ fontSize: "14px", color: "#555" }}>
                            Compte client : <span style={{ fontWeight: "600", color: "#111" }}>{loan.userEmail}</span>
                          </div>
                          <div className="b99-admin-contact-email" style={{ fontSize: "14px", color: "#555" }}>
                            Email procédure : <span style={{ fontWeight: "600", color: "#0056b3", background: "#eef5fc", padding: "2px 6px", borderRadius: "4px" }}>{loan.contactEmail || "Non communiqué"}</span>
                          </div>
                        </div>
                        {loan.reason && (
                          <div className="b99-admin-reason-bubble" style={{ marginTop: "10px" }}>
                            <strong>Raison :</strong> {loan.reason}
                          </div>
                        )}
                        <div className="b99-admin-timestamp" style={{ marginTop: "8px" }}>
                          Soumis le {new Date(loan.createdAt).toLocaleString("fr-FR")}
                        </div>
                      </div>
                      <div className="b99-admin-loan-metrics">
                        <div className="b99-admin-amount">{loan.loanAmount.toLocaleString("fr-FR")} €</div>
                        <div className="b99-admin-details">
                          {loan.duration} ans — {loan.monthlyPayment.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €/mois
                        </div>
                        
                        {/* SÉLECTEUR DE STATUT INTERACTIF */}
                        <div className="b99-admin-status-select-container">
                          <select
                            value={loan.status}
                            onChange={(e) => handleUpdateStatus(loan.id, e.target.value)}
                            disabled={updatingLoanId === loan.id}
                            className={`b99-admin-status-select status-${loan.status.toLowerCase()}`}
                          >
                            <option value="En cours">⚙️ En cours</option>
                            <option value="Approuvé">✅ Approuvé</option>
                            <option value="Refusé">❌ Refusé</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="b99-admin-card-header">Ajustement du solde des portefeuilles clients</div>
            <div className="b99-admin-card-body">
              {allUsers.length === 0 ? (
                <p className="b99-admin-empty-state">Aucun utilisateur inscrit.</p>
              ) : (
                <div className="b99-admin-users-list">
                  {allUsers.map((u) => (
                    <div key={u.id} className="b99-admin-user-row">
                      <div className="b99-admin-user-identity">
                        <strong style={{ fontSize: "16px", color: "#111" }}>
                          {u.firstname || u.lastname ? `${u.firstname || ""} ${u.lastname || ""}` : "Client Sans Nom"}
                        </strong>
                        <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>{u.email}</div>
                        <div className="b99-admin-current-balance-badge">
                          Solde actuel : <span>{(u.balance || 0).toLocaleString("fr-FR")} €</span>
                        </div>
                      </div>

                      <div className="b99-admin-balance-actions-form">
                        <input 
                          type="number" 
                          placeholder="Montant (€)"
                          className="b99-admin-balance-input"
                          value={balanceInputs[u.email] || ""}
                          onChange={(e) => setBalanceInputs({ ...balanceInputs, [u.email]: e.target.value })}
                          disabled={updatingEmail === u.email}
                        />
                        <button 
                          onClick={() => handleUpdateBalance(u.email, "add")}
                          className="b99-admin-btn-action-balance add-btn"
                          disabled={updatingEmail === u.email}
                        >
                          ➕ Ajouter
                        </button>
                        <button 
                          onClick={() => handleUpdateBalance(u.email, "set")}
                          className="b99-admin-btn-action-balance set-btn"
                          disabled={updatingEmail === u.email}
                        >
                          ✏️ Fixer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "transfers" && (
          <>
            <div className="b99-admin-card-header">Ordres de virements SEPA émis par les clients</div>
            <div className="b99-admin-card-body">
              {allTransfers.length === 0 ? (
                <p className="b99-admin-empty-state">Aucun ordre de transfert en attente.</p>
              ) : (
                <div className="b99-admin-loans-list">
                  {allTransfers.map((t) => (
                    <div key={t.id} className="b99-admin-loan-row" style={{ borderLeft: t.status === "Approuvé" ? "4px solid green" : t.status === "Refusé" ? "4px solid red" : "4px solid orange" }}>
                      <div className="b99-admin-loan-main-info">
                        <div>
                          <span className="b99-admin-id-badge">TRID: {t.id}</span>
                          <strong> Pour : {t.beneficiaryName}</strong>
                        </div>
                        <div style={{ fontSize: "14px", margin: "6px 0", color: "#444" }}>
                          Émis par : <b>{t.userEmail}</b> <br />
                          IBAN : <code style={{ background: "#eee", padding: "2px 4px" }}>{t.iban}</code> | BIC: <code>{t.bic}</code>
                        </div>
                        <div className="b99-admin-timestamp">Le {new Date(t.createdAt).toLocaleString("fr-FR")}</div>
                      </div>
                      <div className="b99-admin-loan-metrics">
                        <div className="b99-admin-amount" style={{ color: "#d32f2f" }}>-{t.amount.toLocaleString("fr-FR")} €</div>
                        <div style={{ marginTop: "10px" }}>
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateTransferStatus(t.id, e.target.value)}
                            disabled={updatingTransferId === t.id || t.status !== "En attente"}
                            className={`b99-admin-status-select status-${t.status.toLowerCase()}`}
                          >
                            <option value="En attente">⏳ En attente</option>
                            <option value="Approuvé">✅ Autoriser (Déduire solde)</option>
                            <option value="Refusé">❌ Refuser</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}