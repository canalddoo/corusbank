"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface UserProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  iban: string; // <-- Ajout de la propriété IBAN reçue de la BDD
}

export default function AccountDetailsPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch("/api/user/details");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          setError("Impossible de charger vos données utilisateur.");
        }
      } catch (err) {
        setError("Erreur réseau lors de la communication avec le serveur.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const bankBic = "SPBAATWWXXX";
  const displayIban = profile?.iban || "Non renseigné";

  if (loading) {
    return (
      <div className="b99-details-container" style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#777" }}>Chargement de vos informations sécurisées...</p>
      </div>
    );
  }

  return (
    <div className="b99-view-wrapper b99-details-container">
      {/* BANNIÈRE DE LA PAGE */}
      <div className="b99-finance-banner b99-details-banner">
        <div className="b99-details-banner-content">
          <div>
            <h2>Détails du compte & Informations personnelles</h2>
            <p>Consultez les données de votre profil extraites de notre base de données sécurisée.</p>
          </div>
          <Link href="/dashboard" className="outline-action-dark-btn b99-details-back-btn">
            <i className="fa-solid fa-arrow-left"></i> Retour au tableau de bord
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fde8e8", color: "#e53e3e", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="b99-details-grid">
        
        {/* COMPOSANT : PROFIL DE L'UTILISATEUR */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i> Profil Utilisateur
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">Nom de famille</span>
              <strong className="b99-details-value text-uppercase">
                {profile?.lastname || "Non renseigné"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Prénom</span>
              <strong className="b99-details-value">
                {profile?.firstname || "Non renseigné"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Adresse e-mail enregistrée</span>
              <strong className="b99-details-value text-blue">
                {profile?.email || "Non renseigné"}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Statut du compte</span>
              <span className="b99-details-status-tag">
                <span className="b99-details-status-dot"></span> Vérifié & Actif
              </span>
            </div>

          </div>
        </div>

        {/* COMPOSANT : COORDONNÉES DE LA BANQUE */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-building-columns" style={{ marginRight: "8px" }}></i> Coordonnées Bancaires Officielles
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">Numéro IBAN</span>
              <div className="b99-details-copy-box">
                {/* <code>{displayIban}</code> */}
                <code>{displayIban}</code>
                {profile?.iban && profile.iban !== "Non configuré" && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(displayIban); alert("IBAN copié dans le presse-papiers !"); }} 
                    title="Copier l'IBAN"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Code BIC / SWIFT</span>
              <strong className="b99-details-value tracking-wide">
                {bankBic}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Nature du compte</span>
              <strong className="b99-details-value">
                Compte Courant 
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* RECOMMANDATION DE SÉCURITÉ */}
      <div className="b99-card-panel b99-details-security-notice">
        <div className="panel-inner-padding b99-details-security-content">
          <div className="b99-details-security-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <strong>Intégrité et Sécurité des données</strong>
            <p>
              Ces informations proviennent directement de votre dossier d'enregistrement sécurisé. Pour toute modification réglementaire de vos informations d'identité, veuillez soumettre une demande signée accompagnée d'un justificatif officiel à votre conseiller attitré.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}