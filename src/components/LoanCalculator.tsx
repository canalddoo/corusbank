"use client";

import { useState, useEffect } from "react";

type TabType = "achat" | "restructuration";
type InterestType = "reparer" | "variable";

export default function LoanCalculator() {
  // Onglet actif
  const [activeTab, setActiveTab] = useState<TabType>("restructuration");

  // Données des curseurs (Inputs)
  const [purchasePrice, setPurchasePrice] = useState<number>(322000);
  const [debtAmount, setDebtAmount] = useState<number>(87200);
  const [interestType, setInterestType] = useState<InterestType>("reparer");
  const [fixedYears, setFixedYears] = useState<number>(10);

  // Résultats calculés
  const [loanAmount, setLoanAmount] = useState<number>(89000);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [nominalRate, setNominalRate] = useState<number>(4.04);
  const [effectiveRate, setEffectiveRate] = useState<number>(4.79);
  const [totalYears, setTotalYears] = useState<number>(11);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Logique de changement de taux et de durée totale selon la durée fixe sélectionnée
  useEffect(() => {
    let baseRate = 4.04;
    let computedTotalYears = 11;

    if (fixedYears === 5) {
      baseRate = 3.00;
      computedTotalYears = 6;
    } else if (fixedYears === 10) {
      baseRate = 4.04; // Aligné sur ta capture d'écran
      computedTotalYears = 11;
    } else if (fixedYears === 15) {
      baseRate = 5.00;
      computedTotalYears = 16;
    } else if (fixedYears === 20) {
      baseRate = 6.00;
      computedTotalYears = 22;
    }

    setNominalRate(baseRate);
    // Le taux effectif global intègre généralement les frais d'assurance/dossier (simulation ici +0.75%)
    setEffectiveRate(parseFloat((baseRate + 0.75).toFixed(2)));
    setTotalYears(computedTotalYears);
  }, [fixedYears]);

  // Synchronisation du montant du financement
  useEffect(() => {
    // Exemple de règle de calcul du montant financé : prix d'achat initial - apport ou ajusté par la restructuration
    if (activeTab === "restructuration") {
      setLoanAmount(debtAmount + 1800); // Règle purement indicative pour s'aligner sur les 89 000 € pour 87 200 € entrés
    } else {
      setLoanAmount(Math.round(purchasePrice * 0.8)); // 80% du prix d'achat par exemple
    }
  }, [purchasePrice, debtAmount, activeTab]);

  // Calcul de la mensualité (Formule standard de prêt à taux fixe)
  useEffect(() => {
    const monthlyRate = (nominalRate / 100) / 12;
    const totalMonths = totalYears * 12;

    if (monthlyRate === 0) {
      const flatPayment = loanAmount / totalMonths;
      setMonthlyPayment(parseFloat(flatPayment.toFixed(2)));
      setTotalPayable(loanAmount);
    } else {
      const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
      setMonthlyPayment(parseFloat(payment.toFixed(2)));
      setTotalPayable(parseFloat((payment * totalMonths).toFixed(2)));
    }
  }, [loanAmount, nominalRate, totalYears]);

  // Calcul de l'échéance de fin de prêt (à partir de l'année actuelle 2026)
  const currentYear = 2026;
  const endYear = currentYear + totalYears;

  return (
    <section className="calculator-section">
      <div className="calculator-container">
        
        {/* PARTE GAUCHE : FORMULAIRE ET CONFIGURATION */}
        <div className="calculator-card-left">
          
          {/* SÉLECTEUR D'ONGLETS */}
          <div className="calc-tabs">
            <button 
              className={`calc-tab ${activeTab === "achat" ? "active" : ""}`}
              onClick={() => setActiveTab("achat")}
            >
              <span className="tab-icon">🛍️</span> achat
            </button>
            <button 
              className={`calc-tab ${activeTab === "restructuration" ? "active" : ""}`}
              onClick={() => setActiveTab("restructuration")}
            >
              <span className="tab-icon">🔄</span> Restructuration de la dette
            </button>
          </div>

          <div className="calc-form-content">
            {/* INPUT 1 : PRIX D'ACHAT INITIAL */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Prix d'achat initial <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={purchasePrice.toLocaleString("fr-FR")} 
                    readOnly 
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="57000" 
                max="2000000" 
                step="5000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="slider-bounds">
                <span>57 000 €</span>
                <span>2 000 000 €</span>
              </div>
            </div>

            {/* INPUT 2 : MONTANT RESTRUCTURATION */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Montant de la restructuration de la dette <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={debtAmount.toLocaleString("fr-FR")} 
                    readOnly 
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="45200" 
                max="172200" 
                step="100"
                value={debtAmount}
                onChange={(e) => setDebtAmount(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="slider-bounds">
                <span>45 200 €</span>
                <span>172 200 €</span>
              </div>
            </div>

            {/* INPUT 3 : INTÉRÊT (RÉPARER / VARIABLE) */}
            <div className="calc-input-group">
              <label className="section-label">Intérêt <span className="info-bubble">?</span></label>
              <div className="interest-toggle-buttons">
                <button 
                  className={`btn-toggle ${interestType === "reparer" ? "active" : ""}`}
                  onClick={() => setInterestType("reparer")}
                >
                  réparer
                </button>
                <button 
                  className={`btn-toggle ${interestType === "variable" ? "active" : ""}`}
                  onClick={() => setInterestType("variable")}
                >
                  variable
                </button>
              </div>
            </div>

            {/* INPUT 4 : TAUX D'INTÉRÊT FIXE EN ANNÉES */}
            <div className="calc-input-group">
              <label className="section-label">Taux d'intérêt fixe en années <span className="info-bubble">?</span></label>
              <div className="years-selector-grid">
                {[5, 10, 15, 20].map((year) => (
                  <button
                    key={year}
                    className={`btn-year ${fixedYears === year ? "active" : ""}`}
                    onClick={() => setFixedYears(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* PARTIE DROITE : AFFICHAGE DES RÉSULTATS */}
        <div className="calculator-card-right">
          <h2 className="results-title">Votre résultat</h2>

          <div className="results-list">
            <div className="result-item">
              <span>Montant du financement <span className="info-bubble">?</span></span>
              <strong className="value-black">{loanAmount.toLocaleString("fr-FR")},00 €</strong>
            </div>
            <div className="result-item">
              <span>Montant total à payer</span>
              <strong className="value-black">{totalPayable.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong>
            </div>
            <div className="result-item">
              <span>Taux d'intérêt fixe pendant {fixedYears} ans</span>
              <strong>{nominalRate.toFixed(2).replace(".", ",")} % pA</strong>
            </div>
            <div className="result-item">
              <span>Taux d'intérêt effectif pour toute la durée</span>
              <strong>{effectiveRate.toFixed(2).replace(".", ",")} % pA</strong>
            </div>
            <div className="result-item">
              <span>Durée totale</span>
              <strong>{totalYears} ans / jusqu'en juin {endYear}</strong>
            </div>
          </div>

          <hr className="results-divider" />

          <div className="monthly-rate-box">
            <span className="box-label">tarif mensuel</span>
            <div className="box-amount-row">
              <span className="big-amount">{monthlyPayment.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
            <span className="box-subtext">taux d'intérêt fixe pendant {fixedYears} ans</span>
          </div>

          <div className="results-action-buttons">
            <button className="btn-submit-action">
              prendre rendez-vous <span className="arrow-down">↓</span>
            </button>
            <button className="btn-save-action">
              Enregistrer le résultat <span className="arrow-right">→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}