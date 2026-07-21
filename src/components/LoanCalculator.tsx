"use client";

import { useState, useEffect } from "react";

type TabType = "purchase" | "restructuring";
type InterestType = "fixed" | "variable";

export default function LoanCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<TabType>("restructuring");

  // Inputs state
  const [purchasePrice, setPurchasePrice] = useState<number>(322000);
  const [debtAmount, setDebtAmount] = useState<number>(87200);
  const [interestType, setInterestType] = useState<InterestType>("fixed");
  const [fixedYears, setFixedYears] = useState<number>(10);

  // Calculated results
  const [loanAmount, setLoanAmount] = useState<number>(89000);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [nominalRate, setNominalRate] = useState<number>(4.04);
  const [effectiveRate, setEffectiveRate] = useState<number>(4.79);
  const [totalYears, setTotalYears] = useState<number>(11);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Logic to change rates and duration according to chosen fixed period
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
    // Effective annual rate includes fees/insurance (+0.75%)
    setEffectiveRate(parseFloat((baseRate + 0.75).toFixed(2)));
    setTotalYears(computedTotalYears);
  }, [fixedYears]);

  // Financing amount synchronization
  useEffect(() => {
    if (activeTab === "restructuring") {
      setLoanAmount(debtAmount + 1800);
    } else {
      setLoanAmount(Math.round(purchasePrice * 0.8));
    }
  }, [purchasePrice, debtAmount, activeTab]);

  // Monthly payment calculation (Fixed-rate standard formula)
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

  // Loan maturity end date calculation
  const currentYear = 2026;
  const endYear = currentYear + totalYears;

  return (
    <section className="calculator-section">
      <div className="calculator-container">
        
        {/* LEFT SIDE: FORM & CONFIGURATION */}
        <div className="calculator-card-left">
          
          {/* TAB SELECTOR */}
          <div className="calc-tabs">
            <button 
              className={`calc-tab ${activeTab === "purchase" ? "active" : ""}`}
              onClick={() => setActiveTab("purchase")}
            >
              <span className="tab-icon">🛍️</span> Purchase
            </button>
            <button 
              className={`calc-tab ${activeTab === "restructuring" ? "active" : ""}`}
              onClick={() => setActiveTab("restructuring")}
            >
              <span className="tab-icon">🔄</span> Debt Restructuring
            </button>
          </div>

          <div className="calc-form-content">
            {/* INPUT 1: INITIAL PURCHASE PRICE */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Initial purchase price <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={purchasePrice.toLocaleString("en-US")} 
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
                <span>€57,000</span>
                <span>€2,000,000</span>
              </div>
            </div>

            {/* INPUT 2: RESTRUCTURING AMOUNT */}
            <div className="calc-input-group">
              <div className="calc-label-row">
                <label>Debt restructuring amount <span className="info-bubble">?</span></label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">€</span>
                  <input 
                    type="text" 
                    value={debtAmount.toLocaleString("en-US")} 
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
                <span>€45,200</span>
                <span>€172,200</span>
              </div>
            </div>

            {/* INPUT 3: INTEREST TYPE (FIXED / VARIABLE) */}
            <div className="calc-input-group">
              <label className="section-label">Interest <span className="info-bubble">?</span></label>
              <div className="interest-toggle-buttons">
                <button 
                  className={`btn-toggle ${interestType === "fixed" ? "active" : ""}`}
                  onClick={() => setInterestType("fixed")}
                >
                  fixed
                </button>
                <button 
                  className={`btn-toggle ${interestType === "variable" ? "active" : ""}`}
                  onClick={() => setInterestType("variable")}
                >
                  variable
                </button>
              </div>
            </div>

            {/* INPUT 4: FIXED INTEREST RATE YEARS */}
            <div className="calc-input-group">
              <label className="section-label">Fixed interest rate period in years <span className="info-bubble">?</span></label>
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

        {/* RIGHT SIDE: RESULTS DISPLAY */}
        <div className="calculator-card-right">
          <h2 className="results-title">Your result</h2>

          <div className="results-list">
            <div className="result-item">
              <span>Financing amount <span className="info-bubble">?</span></span>
              <strong className="value-black">€{loanAmount.toLocaleString("en-US")}.00</strong>
            </div>
            <div className="result-item">
              <span>Total amount payable</span>
              <strong className="value-black">€{totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="result-item">
              <span>Fixed interest rate for {fixedYears} years</span>
              <strong>{nominalRate.toFixed(2)}% p.a.</strong>
            </div>
            <div className="result-item">
              <span>Effective interest rate for full term</span>
              <strong>{effectiveRate.toFixed(2)}% p.a.</strong>
            </div>
            <div className="result-item">
              <span>Total term</span>
              <strong>{totalYears} years / until June {endYear}</strong>
            </div>
          </div>

          <hr className="results-divider" />

          <div className="monthly-rate-box">
            <span className="box-label">monthly installment</span>
            <div className="box-amount-row">
              <span className="big-amount">€{monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <span className="box-subtext">fixed interest rate for {fixedYears} years</span>
          </div>

          <div className="results-action-buttons">
            <button className="btn-submit-action">
              book an appointment <span className="arrow-down">↓</span>
            </button>
            <button className="btn-save-action">
              Save result <span className="arrow-right">→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}