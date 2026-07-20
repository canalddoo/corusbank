"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface UserProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  iban: string;
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
          setError("Uw gebruikersgegevens konnten niet worden geladen.");
        }
      } catch (err) {
        setError("Netwerkfout bij de communicatie met de server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const bankBic = "SPBAATWWXXX";
  const displayIban = profile?.iban || "Niet opgegeven";

  if (loading) {
    return (
      <div className="b99-details-container" style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#777" }}>Uw beveiligde gegevens worden geladen...</p>
      </div>
    );
  }

  return (
    <div className="b99-view-wrapper b99-details-container">
      {/* PAGINABANNER */}
      <div className="b99-finance-banner b99-details-banner">
        <div className="b99-details-banner-content">
          <div>
            <h2>Rekeningdetails & Persoonlijke gegevens</h2>
            <p>Bekijk uw profielgegevens uit onze beveiligde databank.</p>
          </div>
          <Link href="/nl/dashboard" className="outline-action-dark-btn b99-details-back-btn">
            <i className="fa-solid fa-arrow-left"></i> Terug naar het dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fde8e8", color: "#e53e3e", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="b99-details-grid">
        
        {/* COMPONENT: GEBRUIKERSPROFIEL */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i> Gebruikersprofiel
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">Achternaam</span>
              <strong className="b99-details-value text-uppercase">
                {profile?.lastname || "Niet opgegeven"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Voornaam</span>
              <strong className="b99-details-value">
                {profile?.firstname || "Niet opgegeven"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Geregistreerd e-mailadres</span>
              <strong className="b99-details-value text-blue">
                {profile?.email || "Niet opgegeven"}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Accountstatus</span>
              <span className="b99-details-status-tag">
                <span className="b99-details-status-dot"></span> Geverifieerd & Actief
              </span>
            </div>

          </div>
        </div>

        {/* COMPONENT: BANKGEGEVENS */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-building-columns" style={{ marginRight: "8px" }}></i> Officiële bankgegevens
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">IBAN-nummer</span>
              <div className="b99-details-copy-box">
                <code>{displayIban}</code>
                {profile?.iban && profile.iban !== "Non configuré" && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(displayIban); alert("IBAN gekopieerd naar klembord!"); }} 
                    title="IBAN kopiëren"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">BIC / SWIFT-code</span>
              <strong className="b99-details-value tracking-wide">
                {bankBic}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Type rekening</span>
              <strong className="b99-details-value">
                Betaalrekening 
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* VEILIGHEIDSADVIES */}
      <div className="b99-card-panel b99-details-security-notice">
        <div className="panel-inner-padding b99-details-security-content">
          <div className="b99-details-security-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <strong>Gegevensintegriteit en Veiligheid</strong>
            <p>
              Deze informatie is rechtstreeks afkomstig uit uw beveiligde registratiedossier. Voor elke officiële wijziging van uw identiteitsgegevens dient u een ondertekend verzoek in te dienen met een officieel bewijsstuk bij uw toegewezen adviseur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}