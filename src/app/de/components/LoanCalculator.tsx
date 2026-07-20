"use client";

import { useState, useEffect } from "react";

type TabType = "kauf" | "umschuldung";
type InterestType = "fix" | "variabel";

export default function LoanCalculator() {
  // Aktiver Tab
  const [activeTab, setActiveTab] = useState<TabType>("umschuldung");

  // Regler-Daten (Inputs)
  const [purchasePrice, setPurchasePrice] = useState<number>(322000);
  const [debtAmount, setDebtAmount] = useState<number>(87200);
  const [interestType, setInterestType] = useState<InterestType>("fix");
  const [fixedYears, setFixedYears] = useState<number>(10);

  // Berechnete Ergebnisse
  const [loanAmount, setLoanAmount] = useState<number>(89000);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [nominalRate, setNominalRate] = useState<number>(4.04);
  const [effectiveRate, setEffectiveRate] = useState<number>(4.79);
  const [totalYears, setTotalYears] = useState<number>(11);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Logik für Zins- und Gesamtlaufzeitänderung je nach gewählter Fixzinsdauer
  useEffect(() => {
    let baseRate = 4.04;
    let computedTotalYears = 11;

    if (fixedYears === 5) {
      baseRate = 3.00;
      computedTotalYears = 6;
    } else if (fixedYears === 10) {
      baseRate = 4.04;
      computedTotalYears = 11;
    } else if (fixedYears === 15) {
      baseRate = 5.00;
      computedTotalYears = 16;
    } else if (fixedYears === 20) {
      baseRate = 6.00;
      computedTotalYears = 22;
    }

    setNominalRate(baseRate);
    setEffectiveRate(parseFloat((baseRate + 0.75).toFixed(2)));
    setTotalYears(computedTotalYears);
  }, [fixedYears]);

  // Synchronisation der Finanzierungssumme
  useEffect(() => {
    if (activeTab === "umschuldung") {
      setLoanAmount(debtAmount + 1800);
    } else {
      setLoanAmount(Math.round(purchasePrice * 0.8));
    }
  }, [purchasePrice, debtAmount, activeTab]);

  // Berechnung der monatlichen Rate
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

  const currentYear = 2026;
  const endYear = currentYear + totalYears;

  return (
    <section className="calculator-section">
      <div className="calculator-container">
        
        {/* LINKE SEITE: FORMULAR UND KONFIGURATION */}
        <div className="calculator-card-left">
          
          {/* TAB-AUSWAHL */}
          <div className="calc-tabs">
            <button 
              className={`calc-tab ${activeTab === "kauf" ? "active" : ""}`}
              onClick={() => setActiveTab("kauf")}
            >
              <span className="tab-icon">🛍️</span> Kauf
            </button>
            <button 
              className={`calc-tab ${activeTab === "umschuldung" ? "active" : ""}`}
              onClick={() => setActiveTab("umschuldung")}
            >
              <span className="tab-icon">🔄</span> Umschuldung / Restrukturierung
            </button>
          </div>

          <div className="calc-form-content">
            {/* INPUT 1: URSPRÜNGLICHER KAUFPREIS */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Ursprünglicher Kaufpreis <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={purchasePrice.toLocaleString("de-DE")} 
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
                <span>57.000 €</span>
                <span>2.000.000 €</span>
              </div>
            </div>

            {/* INPUT 2: UMSCHULDUNGSBETRAG */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Betrag der Umschuldung <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={debtAmount.toLocaleString("de-DE")} 
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
                <span>45.200 €</span>
                <span>172.200 €</span>
              </div>
            </div>

            {/* INPUT 3: ZINS (FIX / VARIABEL) */}
            <div className="calc-input-group">
              <label className="section-label">Zinsart <span className="info-bubble">?</span></label>
              <div className="interest-toggle-buttons">
                <button 
                  className={`btn-toggle ${interestType === "fix" ? "active" : ""}`}
                  onClick={() => setInterestType("fix")}
                >
                  fix
                </button>
                <button 
                  className={`btn-toggle ${interestType === "variabel" ? "active" : ""}`}
                  onClick={() => setInterestType("variabel")}
                >
                  variabel
                </button>
              </div>
            </div>

            {/* INPUT 4: FIXZINSBINDUNG IN JAHREN */}
            <div className="calc-input-group">
              <label className="section-label">Fixzinsbindung in Jahren <span className="info-bubble">?</span></label>
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

        {/* RECHTE SEITE: ERGEBNISANZEIGE */}
        <div className="calculator-card-right">
          <h2 className="results-title">Ihr Ergebnis</h2>

          <div className="results-list">
            <div className="result-item">
              <span>Finanzierungsbetrag <span className="info-bubble">?</span></span>
              <strong className="value-black">{loanAmount.toLocaleString("de-DE")},00 €</strong>
            </div>
            <div className="result-item">
              <span>Gesamtrückzahlungsbetrag</span>
              <strong className="value-black">{totalPayable.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong>
            </div>
            <div className="result-item">
              <span>Fester Sollzinssatz für {fixedYears} Jahre</span>
              <strong>{nominalRate.toFixed(2).replace(".", ",")} % p.a.</strong>
            </div>
            <div className="result-item">
              <span>Effektiver Jahreszins für die Gesamtlaufzeit</span>
              <strong>{effectiveRate.toFixed(2).replace(".", ",")} % p.a.</strong>
            </div>
            <div className="result-item">
              <span>Gesamtlaufzeit</span>
              <strong>{totalYears} Jahre / bis Juni {endYear}</strong>
            </div>
          </div>

          <hr className="results-divider" />

          <div className="monthly-rate-box">
            <span className="box-label">Monatliche Rate</span>
            <div className="box-amount-row">
              <span className="big-amount">{monthlyPayment.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
            <span className="box-subtext">Fixzinsbindung für {fixedYears} Jahre</span>
          </div>

          <div className="results-action-buttons">
            <button className="btn-submit-action">
              Termin vereinbaren <span className="arrow-down">↓</span>
            </button>
            <button className="btn-save-action">
              Ergebnis speichern <span className="arrow-right">→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}