"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

interface CardInfoData {
  id: number;
  fullname: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  iban: string; 
}

interface UserProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  iban: string;
}

export default function BankCardPage() {
  const [hasCard, setHasCard] = useState(false);
  const [cardData, setCardData] = useState<CardInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isCardFrozen, setIsCardFrozen] = useState(false);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [error, setError] = useState("");

  // Regroupement des requêtes au chargement pour un état loading propre
  const fetchInitialData = async () => {
    try {
      // 1. Récupération des données de la carte
      const cardRes = await fetch("/api/user/card");
      if (cardRes.ok) {
        const data = await cardRes.json();
        setHasCard(data.hasCard);
        setCardData(data.cardInfo);
      }

      // 2. Récupération du profil utilisateur
      const profileRes = await fetch("/api/user/details");
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.user);
      } else {
        setError("Impossible de charger vos données utilisateur.");
      }
    } catch (err) {
      console.error("Erreur chargement des données:", err);
      setError("Erreur réseau lors de la communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCreateCard = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/user/card", { method: "POST" });
      if (res.ok) {
        setTimeout(async () => {
          // On recharge uniquement la carte après génération
          try {
            const cardRes = await fetch("/api/user/card");
            if (cardRes.ok) {
              const data = await cardRes.json();
              setHasCard(data.hasCard);
              setCardData(data.cardInfo);
            }
          } catch (err) {
            console.error("Erreur rafraîchissement carte:", err);
          }
          setGenerating(false);
        }, 1500);
      } else {
        alert("Erreur lors de la création de la carte.");
        setGenerating(false);
      }
    } catch (err) {
      alert("Erreur réseau.");
      setGenerating(false);
    }
  };

  const bankBic = "SPBAATWWXXX";
  const displayIban = profile?.iban || "Non renseigné";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "#777" }}>Chargement de vos options sécurisées...</p>
      </div>
    );
  }

  return (
    <div className="b99-view-wrapper">
      {/* BANNIÈRE */}
      <div className="b99-finance-banner" style={{ marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2>Mes Cartes Bancaires</h2>
            <p>Gérer vos options de paiement et visualisez votre carte de débit physique CorusBank.</p>
          </div>
          <Link href="/dashboard" className="b99-details-back-btn" style={{ textDecoration: "none" }}>
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Affichage des erreurs éventuelles sans bloquer l'interface */}
      {error && <div style={{ color: "red", padding: "10px", textAlign: "center" }}>{error}</div>}

      {!hasCard ? (
        /* PROPOSITION DE CARTE */
        <div className="b99-card-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
          {!generating ? (
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <div style={{ fontSize: "50px", color: "#ffcc00", marginBottom: "20px" }}>
                💳
              </div>
              <h3 style={{ marginBottom: "10px" }}>Vous n'avez pas encore de carte de débit</h3>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px", lineHeight: "1.5" }}>
                Générez instantanément votre carte Mastercard® ChorusBank pour effectuer vos transactions en ligne et en magasin en toute sécurité.
              </p>
              <button onClick={handleCreateCard} className="primary-action-yellow-btn" style={{ padding: "12px 30px", fontSize: "15px", cursor: "pointer" }}>
                Obtenir une carte
              </button>
            </div>
          ) : (
            /* LOADER LORS DE LA CRÉATION */
            <div style={{ padding: "30px 0" }}>
              <div className="b99-spinner-loader" style={{ margin: "0 auto" }}></div>
              <h4 style={{ marginTop: "25px", color: "#111" }}>Génération de vos identifiants bancaires sécurisés...</h4>
              <p style={{ color: "#777", fontSize: "13px" }}>Calcul des clés cryptographiques EMV et CVC en cours</p>
            </div>
          )}
        </div>
      ) : (
        /* ÉCRAN PRINCIPAL : REPRODUCTION DU VERSO */
        <div className="b99-card-layout-grid">
          
          <div className="b99-card-panel" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
            <div className={`b99-physical-card-back ${isCardFrozen ? "card-frozen" : ""}`}>
              
              {/* Mentions du haut et Bande Magnétique */}
              <div className="b99-card-top-texts">Eine Karte der CorusBank AG &nbsp;&nbsp; BIC: SPBAATWW &nbsp;&nbsp; Hotline: 01 90202</div>
              <div className="b99-card-magnetic-stripe"></div>

              {/* Ligne Médiane : QR Code et Logos Techniques */}
              <div className="b99-card-mid-row">
                <div className="b99-card-qrcode-mock" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3px', background: '#ffffff' }}>
                  {cardData?.iban ? (
                    <QRCodeSVG 
                      value={cardData.iban} 
                      size={44} 
                      bgColor={"#ffffff"} 
                      fgColor={"#000000"}  
                      level={"L"}
                    />
                  ) : (
                    <div className="qr-inner-box"></div>
                  )}
                </div>
                
                <div className="b99-card-tech-logos">
                  <span style={{ fontSize: "14px", color: "#aaa" }}>C€</span>
                </div>

                <div className="b99-card-recycle-badge">
                  <span>min. 99% recyceltes PVC</span>
                </div>
              </div>

              {/* Bloc Principal des Données Typographiques (Dos de carte) */}
              <div className="b99-card-back-data-block">
                
                {/* Colonne de Gauche */}
                <div className="data-col-left">
                  <div className="b99-data-row">
                    <span className="b99-label">Karten-Nr.</span>
                    <span className="b99-value highlight-num">{cardData?.cardNumber}</span>
                  </div>
                  <div className="b99-data-row">
                    <span className="b99-label">Name</span>
                    <span className="b99-value uppercase-txt">{cardData?.fullname}</span>
                  </div>
                  <div className="b99-data-row">
                    <span className="b99-label">IBAN</span>
                    <span className="b99-value format-iban">{displayIban}</span>
                  </div>
                </div>

                {/* Colonne de Droite */}
                <div className="data-col-right">
                  <div className="b99-data-row inline-row">
                    <span className="b99-label">Gültig bis</span>
                    <span className="b99-value">{cardData?.expiryDate}</span>
                  </div>
                  <div className="b99-data-row inline-row">
                    <span className="b99-label">Folge-Nr.</span>
                    <span className="b99-value">1</span>
                  </div>
                  <div className="b99-data-row inline-row">
                    <span className="b99-label">CVC</span>
                    <span className="b99-value font-mono">{cardData?.cvc}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* SÉCURITÉ */}
          <div className="b99-card-panel">
            <div className="gray-header-strip-title">Options de sécurité de la carte</div>
            <div className="panel-inner-padding" style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "20px" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "15px" }}>Statut de la carte</strong>
                  <span style={{ fontSize: "13px", color: "#666" }}>Geler temporairement l'usage de vos identifiants</span>
                </div>
                <button 
                  onClick={() => setIsCardFrozen(!isCardFrozen)}
                  className={`b99-toggle-action-btn ${isCardFrozen ? "btn-danger" : "btn-success"}`}
                >
                  {isCardFrozen ? "❄️ Geler la carte" : "🟢 Carte Active"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "15px" }}>Paiements internet</strong>
                  <span style={{ fontSize: "13px", color: "#666" }}>Autoriser l'utilisation du numéro de carte en ligne</span>
                </div>
                <span style={{ fontWeight: "bold", color: "#2e7d32", fontSize: "14px" }}>✓ Activé</span>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}