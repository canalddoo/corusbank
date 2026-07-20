"use client";

import { useState, useEffect } from "react";

type TabType = "kauf" | "umschuldung";
type InterestType = "fix" | "variabel";

export default function LoanCalculator() {
  // Actieve tab
  const [activeTab, setActiveTab] = useState<TabType>("umschuldung");

  // Slider-gegevens (Inputs)
  const [purchasePrice, setPurchasePrice] = useState<number>(322000);
  const [debtAmount, setDebtAmount] = useState<number>(87200);
  const [interestType, setInterestType] = useState<InterestType>("fix");
  const [fixedYears, setFixedYears] = useState<number>(10);

  // Berekende resultaten
  const [loanAmount, setLoanAmount] = useState<number>(89000);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [nominalRate, setNominalRate] = useState<number>(4.04);
  const [effectiveRate, setEffectiveRate] = useState<number>(4.79);
  const [totalYears, setTotalYears] = useState<number>(11);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Logica voor rente- en looptijdwijzigingen op basis van de gekozen vaste renteperiode
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

  // Synchronisatie van het financieringsbedrag
  useEffect(() => {
    if (activeTab === "umschuldung") {
      setLoanAmount(debtAmount + 1800);
    } else {
      setLoanAmount(Math.round(purchasePrice * 0.8));
    }
  }, [purchasePrice, debtAmount, activeTab]);

  // Berekening van de maandelijkse aflossing
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
        
        {/* LINKERKANT: FORMULIER EN CONFIGURATIE */}
        <div className="calculator-card-left">
          
          {/* TAB-SELECTIE */}
          <div className="calc-tabs">
            <button 
              className={`calc-tab ${activeTab === "kauf" ? "active" : ""}`}
              onClick={() => setActiveTab("kauf")}
            >
              <span className="tab-icon">🛍️</span> Aankoop
            </button>
            <button 
              className={`calc-tab ${activeTab === "umschuldung" ? "active" : ""}`}
              onClick={() => setActiveTab("umschuldung")}
            >
              <span className="tab-icon">🔄</span> Herfinanciering / Herschikking
            </button>
          </div>

          <div className="calc-form-content">
            {/* INPUT 1: OORSPRONKELIJKE AANKOOPPRIJS */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Oorspronkelijke aankoopprijs <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={purchasePrice.toLocaleString("nl-NL")} 
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

            {/* INPUT 2: HERFINANCIERINGSBEDRAG */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Bedrag van herfinanciering <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={debtAmount.toLocaleString("nl-NL")} 
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

            {/* INPUT 3: RENTETYPE (VAST / VARIABEL) */}
            <div className="calc-input-group">
              <label className="section-label">Rentetype <span className="info-bubble">?</span></label>
              <div className="interest-toggle-buttons">
                <button 
                  className={`btn-toggle ${interestType === "fix" ? "active" : ""}`}
                  onClick={() => setInterestType("fix")}
                >
                  vast
                </button>
                <button 
                  className={`btn-toggle ${interestType === "variabel" ? "active" : ""}`}
                  onClick={() => setInterestType("variabel")}
                >
                  variabel
                </button>
              </div>
            </div>

            {/* INPUT 4: VASTE RENTEVASTPERIODE IN JAREN */}
            <div className="calc-input-group">
              <label className="section-label">Rentevastperiode in jaren <span className="info-bubble">?</span></label>
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

        {/* RECHTERKANT: RESULTATENWEERGAVE */}
        <div className="calculator-card-right">
          <h2 className="results-title">Uw resultaat</h2>

          <div className="results-list">
            <div className="result-item">
              <span>Financieringsbedrag <span className="info-bubble">?</span></span>
              <strong className="value-black">{loanAmount.toLocaleString("nl-NL")},00 €</strong>
            </div>
            <div className="result-item">
              <span>Totaal terug te betalen bedrag</span>
              <strong className="value-black">{totalPayable.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong>
            </div>
            <div className="result-item">
              <span>Vaste debetrentevoet voor {fixedYears} jaar</span>
              <strong>{nominalRate.toFixed(2).replace(".", ",")} % p.j.</strong>
            </div>
            <div className="result-item">
              <span>Jaarlijks kostenpercentage (JKP) voor de totale looptijd</span>
              <strong>{effectiveRate.toFixed(2).replace(".", ",")} % p.j.</strong>
            </div>
            <div className="result-item">
              <span>Totale looptijd</span>
              <strong>{totalYears} jaar / tot juni {endYear}</strong>
            </div>
          </div>

          <hr className="results-divider" />

          <div className="monthly-rate-box">
            <span className="box-label">Maandelijkse aflossing</span>
            <div className="box-amount-row">
              <span className="big-amount">{monthlyPayment.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
            <span className="box-subtext">Rentevastperiode voor {fixedYears} jaar</span>
          </div>

          <div className="results-action-buttons">
            <button className="btn-submit-action">
              Afspraak maken <span className="arrow-down">↓</span>
            </button>
            <button className="btn-save-action">
              Resultaat opslaan <span className="arrow-right">→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}