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
          setError("Ihre Benutzerdaten konnten nicht geladen werden.");
        }
      } catch (err) {
        setError("Netzwerkfehler bei der Kommunikation mit dem Server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const bankBic = "SPBAATWWXXX";
  const displayIban = profile?.iban || "Nicht angegeben";

  if (loading) {
    return (
      <div className="b99-details-container" style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#777" }}>Ihre sicheren Informationen werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="b99-view-wrapper b99-details-container">
      {/* SEITEN-BANNER */}
      <div className="b99-finance-banner b99-details-banner">
        <div className="b99-details-banner-content">
          <div>
            <h2>Kontodaten & Persönliche Informationen</h2>
            <p>Rufen Sie Ihre Profildaten aus unserer sicheren Datenbank ab.</p>
          </div>
          <Link href="/de/dashboard" className="outline-action-dark-btn b99-details-back-btn">
            <i className="fa-solid fa-arrow-left"></i> Zurück zum Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fde8e8", color: "#e53e3e", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="b99-details-grid">
        
        {/* KOMPONENTE: BENUTZERPROFIL */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i> Benutzerprofil
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">Nachname</span>
              <strong className="b99-details-value text-uppercase">
                {profile?.lastname || "Nicht angegeben"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Vorname</span>
              <strong className="b99-details-value">
                {profile?.firstname || "Nicht angegeben"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Registrierte E-Mail-Adresse</span>
              <strong className="b99-details-value text-blue">
                {profile?.email || "Nicht angegeben"}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Kontostatus</span>
              <span className="b99-details-status-tag">
                <span className="b99-details-status-dot"></span> Verifiziert & Aktiv
              </span>
            </div>

          </div>
        </div>

        {/* KOMPONENTE: BANKVERBINDUNG */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-building-columns" style={{ marginRight: "8px" }}></i> Offizielle Bankverbindung
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">IBAN-Nummer</span>
              <div className="b99-details-copy-box">
                <code>{displayIban}</code>
                {profile?.iban && profile.iban !== "Non configuré" && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(displayIban); alert("IBAN in die Zwischenablage kopiert!"); }} 
                    title="IBAN kopieren"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">BIC / SWIFT-Code</span>
              <strong className="b99-details-value tracking-wide">
                {bankBic}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Kontoart</span>
              <strong className="b99-details-value">
                Girokonto 
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* SICHERHEITSHINWEIS */}
      <div className="b99-card-panel b99-details-security-notice">
        <div className="panel-inner-padding b99-details-security-content">
          <div className="b99-details-security-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <strong>Datenintegrität und Sicherheit</strong>
            <p>
              Diese Informationen stammen direkt aus Ihrer gesicherten Registrierungsakte. Für jede behördliche Änderung Ihrer Identitätsdaten reichen Sie bitte einen unterzeichneten Antrag zusammen mit einem offiziellen Nachweis bei Ihrem zugewiesenen Berater ein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}