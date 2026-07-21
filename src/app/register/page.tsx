"use client";

import { useState } from "react";

export default function RegisterForm() {
  // Steps now range from 2 to 4 (2: Personal, 3: Financial, 4: Legal aspects)
  const [currentStep, setCurrentStep] = useState<2 | 3 | 4>(2);

  // Step 2 State: Personal Data
  const [personalData, setPersonalData] = useState({
    title1: "",
    title2: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    birthCountry: "",
    nationality: "",
    otherNationalities: "No",
    civilStatus: "",
    phonePassword: "",
    address: "",
    postalCode: "",
    city: "",
    mobile: "",
    email: "",
    agreePrecontractual: false,
    agreeContact: false
  });

  // Step 3 State: Financial Data
  const [financialData, setFinancialData] = useState({
    monthlyNetIncome: "",
    monthlyDeposits: "",
    incomeSources: [] as string[],
    hasCar: "No",
    housingStatus: "",
    dependentChildren: "",
    professionalGroup: "",
    industry: "",
    foreignPayments: "No",
    openingReason: "",
    taxResidence: "Exclusively Austria",
    usLinks: "No"
  });

  // Step 4 State: Legal Aspects
  const [legalData, setLegalData] = useState({
    acceptTerms: false,
    pepStatus: "No",
    fatcaDeclaration: false
  });

  const handleCheckboxChange = (source: string) => {
    const currentSources = [...financialData.incomeSources];
    if (currentSources.includes(source)) {
      setFinancialData({
        ...financialData,
        incomeSources: currentSources.filter((s) => s !== source)
      });
    } else {
      setFinancialData({
        ...financialData,
        incomeSources: [...currentSources, source]
      });
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo(0, 0);
    } else {
      // Final Step 4: Submission to backend server
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalData, financialData, legalData }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert("Registration completed and saved to the database!");
          // Optional: redirect to dashboard or login
          // window.location.href = "/login";
        } else {
          alert(data.error || "An error occurred during validation.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Unable to reach the server.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="register-container">
      {/* 1. ADJUSTED VISUAL PROGRESS BAR (4 STEPS) */}
      <div className="progress-stepper">
        <div className="step-item completed">
          <div className="step-circle"><i className="fa-solid fa-check"></i></div>
          <span>1. Product selection</span>
        </div>
        <div className={`step-item ${currentStep === 2 ? "active" : "completed"}`}>
          <div className="step-circle">{currentStep > 2 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>2. Personal details</span>
        </div>
        <div className={`step-item ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep > 3 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>3. Financial details</span>
        </div>
        <div className={`step-item ${currentStep === 4 ? "active" : ""}`}>
          <div className="step-circle"></div>
          <span>4. Legal aspects</span>
        </div>
      </div>

      {/* MAIN FORM */}
      <form onSubmit={handleNext} className="register-card">
        
        {/* ==============================================
            STEP 2: PERSONAL DATA
            ============================================== */}
        {currentStep === 2 && (
          <div className="form-section animate-fade">
            <h2>Personal details</h2>
            
            <div className="form-group row-flex">
              <label className="main-label">Title</label>
              <div className="inputs-container split-2">
                <select 
                  value={personalData.title1} 
                  onChange={(e) => setPersonalData({...personalData, title1: e.target.value})}
                  required
                >
                  <option value="">Please select a t...</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="DI Mag. (FH)">DI Mag. (FH)</option>
                </select>
                <select 
                  value={personalData.title2} 
                  onChange={(e) => setPersonalData({...personalData, title2: e.target.value})}
                >
                  <option value="">Please select a t...</option>
                  <option value="MPS">MPS</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">First name(s) *</label>
              <div className="inputs-container has-info">
                <input 
                  type="text" 
                  value={personalData.firstname} 
                  onChange={(e) => setPersonalData({...personalData, firstname: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Last name *</label>
              <div className="inputs-container has-info">
                <input 
                  type="text" 
                  value={personalData.lastname} 
                  onChange={(e) => setPersonalData({...personalData, lastname: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Date of birth *</label>
              <div className="inputs-container has-info">
                <input 
                  type="date" 
                  value={personalData.birthdate} 
                  onChange={(e) => setPersonalData({...personalData, birthdate: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Country of birth *</label>
              
              <div className="inputs-container has-info">
                <select 
                  value={personalData.birthCountry} 
                  onChange={(e) => setPersonalData({...personalData, birthCountry: e.target.value})}
                  required
                >
                  <option value="">Please choose</option>
<option value="Afghanistan">Afghanistan</option>
<option value="Afrique du Sud">Afrique du Sud</option>
<option value="Albanie">Albanie</option>
<option value="Algérie">Algérie</option>
<option value="Allemagne">Allemagne</option>
<option value="Andorre">Andorre</option>
<option value="Angola">Angola</option>
<option value="Antigua-et-Barbuda">Antigua-et-Barbuda</option>
<option value="Arabie saoudite">Arabie saoudite</option>
<option value="Argentine">Argentine</option>
<option value="Arménie">Arménie</option>
<option value="Australie">Australie</option>
<option value="Autriche">Autriche</option>
<option value="Azerbaïdjan">Azerbaïdjan</option>
<option value="Bahamas">Bahamas</option>
<option value="Bahreïn">Bahreïn</option>
<option value="Bangladesh">Bangladesh</option>
<option value="Barbade">Barbade</option>
<option value="Belgique">Belgique</option>
<option value="Belize">Belize</option>
<option value="Bénin">Bénin</option>
<option value="Bhoutan">Bhoutan</option>
<option value="Biélorussie">Biélorussie</option>
<option value="Birmanie">Birmanie</option>
<option value="Bolivie">Bolivie</option>
<option value="Bosnie-Herzégovine">Bosnie-Herzégovine</option>
<option value="Botswana">Botswana</option>
<option value="Brésil">Brésil</option>
<option value="Brunei">Brunei</option>
<option value="Bulgarie">Bulgarie</option>
<option value="Burkina Faso">Burkina Faso</option>
<option value="Burundi">Burundi</option>
<option value="Cambodge">Cambodge</option>
<option value="Cameroun">Cameroun</option>
<option value="Canada">Canada</option>
<option value="Cap-Vert">Cap-Vert</option>
<option value="Centrafrique">Centrafrique</option>
<option value="Chili">Chili</option>
<option value="Chine">Chine</option>
<option value="Chypre">Chypre</option>
<option value="Colombie">Colombie</option>
<option value="Comores">Comores</option>
<option value="Congo-Brazzaville">Congo-Brazzaville</option>
<option value="Congo-Kinshasa">Congo-Kinshasa</option>
<option value="Corée du Nord">Corée du Nord</option>
<option value="Corée du Sud">Corée du Sud</option>
<option value="Costa Rica">Costa Rica</option>
<option value="Côte d'Ivoire">Côte d'Ivoire</option>
<option value="Croatie">Croatie</option>
<option value="Cuba">Cuba</option>
<option value="Danemark">Danemark</option>
<option value="Djibouti">Djibouti</option>
<option value="Dominique">Dominique</option>
<option value="Égypte">Égypte</option>
<option value="Émirats arabes unis">Émirats arabes unis</option>
<option value="Équateur">Équateur</option>
<option value="Érythrée">Érythrée</option>
<option value="Espagne">Espagne</option>
<option value="Estonie">Estonie</option>
<option value="Eswatini">Eswatini</option>
<option value="États-Unis">États-Unis</option>
<option value="Éthiopie">Éthiopie</option>
<option value="Fidji">Fidji</option>
<option value="Finlande">Finlande</option>
<option value="France">France</option>
<option value="Gabon">Gabon</option>
<option value="Gambie">Gambie</option>
<option value="Géorgie">Géorgie</option>
<option value="Ghana">Ghana</option>
<option value="Grèce">Grèce</option>
<option value="Grenade">Grenade</option>
<option value="Guatemala">Guatemala</option>
<option value="Guinée">Guinée</option>
<option value="Guinée équatoriale">Guinée équatoriale</option>
<option value="Guinée-Bissau">Guinée-Bissau</option>
<option value="Guyana">Guyana</option>
<option value="Haïti">Haïti</option>
<option value="Honduras">Honduras</option>
<option value="Hongrie">Hongrie</option>
<option value="Inde">Inde</option>
<option value="Indonésie">Indonésie</option>
<option value="Irak">Irak</option>
<option value="Iran">Iran</option>
<option value="Irlande">Irlande</option>
<option value="Islande">Islande</option>
<option value="Israël">Israël</option>
<option value="Italie">Italie</option>
<option value="Jamaïque">Jamaïque</option>
<option value="Japon">Japon</option>
<option value="Jordanie">Jordanie</option>
<option value="Kazakhstan">Kazakhstan</option>
<option value="Kenya">Kenya</option>
<option value="Kirghizistan">Kirghizistan</option>
<option value="Kiribati">Kiribati</option>
<option value="Koweït">Koweït</option>
<option value="Laos">Laos</option>
<option value="Lesotho">Lesotho</option>
<option value="Lettonie">Lettonie</option>
<option value="Liban">Liban</option>
<option value="Libéria">Libéria</option>
<option value="Libye">Libye</option>
<option value="Liechtenstein">Liechtenstein</option>
<option value="Lituanie">Lituanie</option>
<option value="Luxembourg">Luxembourg</option>
<option value="Macédoine du Nord">Macédoine du Nord</option>
<option value="Madagascar">Madagascar</option>
<option value="Malaisie">Malaisie</option>
<option value="Malawi">Malawi</option>
<option value="Maldives">Maldives</option>
<option value="Mali">Mali</option>
<option value="Malte">Malte</option>
<option value="Maroc">Maroc</option>
<option value="Marshall">Marshall</option>
<option value="Maurice">Maurice</option>
<option value="Mauritanie">Mauritanie</option>
<option value="Mexique">Mexique</option>
<option value="Micronésie">Micronésie</option>
<option value="Moldavie">Moldavie</option>
<option value="Monaco">Monaco</option>
<option value="Mongolie">Mongolie</option>
<option value="Monténégro">Monténégro</option>
<option value="Mozambique">Mozambique</option>
<option value="Namibie">Namibie</option>
<option value="Nauru">Nauru</option>
<option value="Népal">Népal</option>
<option value="Nicaragua">Nicaragua</option>
<option value="Niger">Niger</option>
<option value="Nigeria">Nigeria</option>
<option value="Norvège">Norvège</option>
<option value="Nouvelle-Zélande">Nouvelle-Zélande</option>
<option value="Oman">Oman</option>
<option value="Ouganda">Ouganda</option>
<option value="Ouzbékistan">Ouzbékistan</option>
<option value="Pakistan">Pakistan</option>
<option value="Palaos">Palaos</option>
<option value="Palestine">Palestine</option>
<option value="Panama">Panama</option>
<option value="Papouasie-Nouvelle-Guinée">Papouasie-Nouvelle-Guinée</option>
<option value="Paraguay">Paraguay</option>
<option value="Pays-Bas">Pays-Bas</option>
<option value="Pérou">Pérou</option>
<option value="Philippines">Philippines</option>
<option value="Pologne">Pologne</option>
<option value="Portugal">Portugal</option>
<option value="Qatar">Qatar</option>
<option value="République dominicaine">République dominicaine</option>
<option value="République tchèque">République tchèque</option>
<option value="Roumanie">Roumanie</option>
<option value="Royaume-Uni">Royaume-Uni</option>
<option value="Russie">Russie</option>
<option value="Rwanda">Rwanda</option>
<option value="Saint-Christophe-et-Niévès">Saint-Christophe-et-Niévès</option>
<option value="Saint-Marin">Saint-Marin</option>
<option value="Saint-Vincent-et-les-Grenadines">Saint-Vincent-et-les-Grenadines</option>
<option value="Sainte-Lucie">Sainte-Lucie</option>
<option value="Salomon">Salomon</option>
<option value="Samoa">Samoa</option>
<option value="Sao Tomé-et-Principe">Sao Tomé-et-Principe</option>
<option value="Sénégal">Sénégal</option>
<option value="Serbie">Serbie</option>
<option value="Seychelles">Seychelles</option>
<option value="Sierra Leone">Sierra Leone</option>
<option value="Singapour">Singapour</option>
<option value="Slovaquie">Slovaquie</option>
<option value="Slovénie">Slovénie</option>
<option value="Somalie">Somalie</option>
<option value="Soudan">Soudan</option>
<option value="Soudan du Sud">Soudan du Sud</option>
<option value="Sri Lanka">Sri Lanka</option>
<option value="Suède">Suède</option>
<option value="Suisse">Suisse</option>
<option value="Suriname">Suriname</option>
<option value="Syrie">Syrie</option>
<option value="Tadjikistan">Tadjikistan</option>
<option value="Taïwan">Taïwan</option>
<option value="Tanzanie">Tanzanie</option>
<option value="Tchad">Tchad</option>
<option value="Thaïlande">Thaïlande</option>
<option value="Timor oriental">Timor oriental</option>
<option value="Togo">Togo</option>
<option value="Tonga">Tonga</option>
<option value="Trinité-et-Tobago">Trinité-et-Tobago</option>
<option value="Tunisie">Tunisie</option>
<option value="Turkménistan">Turkménistan</option>
<option value="Turquie">Turquie</option>
<option value="Tuvalu">Tuvalu</option>
<option value="Ukraine">Ukraine</option>
<option value="Uruguay">Uruguay</option>
<option value="Vanuatu">Vanuatu</option>
<option value="Vatican">Vatican</option>
<option value="Venezuela">Venezuela</option>
<option value="Viêt Nam">Viêt Nam</option>
<option value="Yémen">Yémen</option>
<option value="Zambie">Zambie</option>
<option value="Zimbabwe">Zimbabwe</option>
                </select>
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>

            </div>

            <div className="form-group row-flex">
              <label className="main-label">Add other nationalities? *</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="otherNationalities" 
                    value="No" 
                    checked={personalData.otherNationalities === "No"} 
                    onChange={(e) => setPersonalData({...personalData, otherNationalities: e.target.value})} 
                  /> No
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="otherNationalities" 
                    value="Yes" 
                    checked={personalData.otherNationalities === "Yes"} 
                    onChange={(e) => setPersonalData({...personalData, otherNationalities: e.target.value})} 
                  /> Yes
                </label>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Marital status *</label>
              <div className="inputs-container">
                <select 
                  value={personalData.civilStatus} 
                  onChange={(e) => setPersonalData({...personalData, civilStatus: e.target.value})}
                  required
                >
                  <option value="">Please select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Phone password *</label>
              <div className="inputs-container vertical-stack">
                <input 
                  type="password" 
                  value={personalData.phonePassword} 
                  onChange={(e) => setPersonalData({...personalData, phonePassword: e.target.value})} 
                  required 
                />
                <div className="info-box-gray">
                  The phone password is required for identification during telephone inquiries.
                </div>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Residential address</h3>

            <div className="form-group row-flex">
              <label className="main-label">Street, house number *</label>
              <div className="inputs-container has-info">
                <input 
                  type="text" 
                  value={personalData.address} 
                  onChange={(e) => setPersonalData({...personalData, address: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Postal code City *</label>
              <div className="inputs-container split-zip">
                <input 
                  type="text" 
                  placeholder="ZIP" 
                  value={personalData.postalCode} 
                  onChange={(e) => setPersonalData({...personalData, postalCode: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="City" 
                  value={personalData.city} 
                  onChange={(e) => setPersonalData({...personalData, city: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Contact details</h3>

            <div className="form-group row-flex">
              <label className="main-label">Mobile phone number *</label>
              <div className="inputs-container has-info">
                <input 
                  type="tel" 
                  value={personalData.mobile} 
                  onChange={(e) => setPersonalData({...personalData, mobile: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Email address *</label>
              <div className="inputs-container has-info">
                <input 
                  type="email" 
                  value={personalData.email} 
                  onChange={(e) => setPersonalData({...personalData, email: e.target.value})} 
                  required 
                />
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label"></label>
              <div className="inputs-container checkbox-wrapper info-box-gray">
                <input 
                  type="checkbox" 
                  id="agreePrecontractual"
                  checked={personalData.agreePrecontractual}
                  onChange={(e) => setPersonalData({...personalData, agreePrecontractual: e.target.checked})}
                  required
                />
                <label htmlFor="agreePrecontractual">
                  Corusbank will send me pre-contractual and contractual information relating to the requested product to the email address I provided. I hereby confirm its accuracy.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            STEP 3: FINANCIAL DATA
            ============================================== */}
        {currentStep === 3 && (
          <div className="form-section animate-fade">
            <h2>Financial details</h2>

            <div className="form-group row-flex">
              <label className="main-label">Monthly net income *</label>
              <div className="inputs-container input-with-unit has-info">
                <input 
                  type="number" 
                  value={financialData.monthlyNetIncome}
                  onChange={(e) => setFinancialData({...financialData, monthlyNetIncome: e.target.value})}
                  required
                />
                <span className="unit-label">EUR</span>
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Monthly account deposits *</label>
              <div className="inputs-container">
                <select 
                  value={financialData.monthlyDeposits}
                  onChange={(e) => setFinancialData({...financialData, monthlyDeposits: e.target.value})}
                  required
                >
                  <option value="">Please select</option>
                  <option value="up to 1,000 EUR">up to 1,000 EUR</option>
                  <option value="1,001 EUR - 1,500 EUR">1,001 EUR - 1,500 EUR</option>
                  <option value="1,501 EUR - 2,000 EUR">1,501 EUR - 2,000 EUR</option>
                  <option value="2,001 EUR - 2,500 EUR">2,001 EUR - 2,500 EUR</option>
                  <option value="2,501 EUR - 3,000 EUR">2,501 EUR - 3,000 EUR</option>
                  <option value="3,001 EUR - 3,500 EUR">3,001 EUR - 3,500 EUR</option>
                  <option value="3,501 EUR - 4,000 EUR">3,501 EUR - 4,000 EUR</option>
                  <option value="4,001 EUR - 4,500 EUR">4,001 EUR - 4,500 EUR</option>
                  <option value="4,501 EUR - 5,000 EUR">4,501 EUR - 5,000 EUR</option>
                  <option value="over 5,000 EUR">over 5,000 EUR</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Where does your current income come from?</label>
              <div className="inputs-container checkbox-list">
                {[
                  "Salary (employee)", "Self-employed activities", 
                  "Public or private pension / insurance benefits income", 
                  "Social benefits income", "Spouse/partner income", 
                  "Divorce settlement, alimony", "Capital gains / Investment returns", 
                  "Assets/Wealth", "Scholarship", "Lottery winnings", "Foundation grants", "No income"
                ].map((source) => (
                  <label key={source} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={financialData.incomeSources.includes(source)}
                      onChange={() => handleCheckboxChange(source)}
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Monthly expenses</h3>

            <div className="form-group row-flex">
              <label className="main-label">Do you own a car?</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="hasCar" 
                    value="No"
                    checked={financialData.hasCar === "No"}
                    onChange={(e) => setFinancialData({...financialData, hasCar: e.target.value})}
                  /> No
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="hasCar" 
                    value="Yes"
                    checked={financialData.hasCar === "Yes"}
                    onChange={(e) => setFinancialData({...financialData, hasCar: e.target.value})}
                  /> Yes
                </label>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Housing situation</label>
              <div className="inputs-container">
                <select 
                  value={financialData.housingStatus}
                  onChange={(e) => setFinancialData({...financialData, housingStatus: e.target.value})}
                >
                  <option value="">Please select</option>
                  <option value="Living with parents">Living with parents</option>
                  <option value="Owner-occupied house">Owner-occupied house</option>
                  <option value="Owner-occupied apartment">Owner-occupied apartment</option>
                  <option value="Renting">Renting</option>
                </select>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Tax residence</h3>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Tax residence outside of Austria?</label>
              <div className="inputs-container vertical-radio-list">
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Exclusively Austria"
                    checked={financialData.taxResidence === "Exclusively Austria"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> You are tax resident exclusively in Austria.
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Austria and Other"
                    checked={financialData.taxResidence === "Austria and Other"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> You are tax resident in Austria and in at least one other country.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            STEP 4: LEGAL ASPECTS
            ============================================== */}
        {currentStep === 4 && (
          <div className="form-section animate-fade">
            <h2>Legal aspects</h2>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Politically Exposed Person (PEP) *</label>
              <div className="inputs-container vertical-stack">
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="pepStatus" 
                      value="No"
                      checked={legalData.pepStatus === "No"}
                      onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                    /> No
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="pepStatus" 
                      value="Yes"
                      checked={legalData.pepStatus === "Yes"}
                      onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                    /> Yes
                  </label>
                </div>
                <div className="info-box-gray">
                  Are you, or an immediate family member, a person who holds or has held important public functions in the past year?
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="form-group row-flex alignment-top">
              <label className="main-label">General Terms and Conditions *</label>
              <div className="inputs-container checkbox-wrapper info-box-gray">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  checked={legalData.acceptTerms}
                  onChange={(e) => setLegalData({...legalData, acceptTerms: e.target.checked})}
                  required
                />
                <label htmlFor="acceptTerms">
                  <strong>I confirm that I have read and accepted the General Terms and Conditions without reservation.</strong>
                  <p>I also acknowledge that I have read the information regarding deposit protection and the bank's personal data privacy policy.</p>
                </label>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">US Tax Status (FATCA) *</label>
              <div className="inputs-container checkbox-wrapper info-box-gray">
                <input 
                  type="checkbox" 
                  id="fatcaDeclaration"
                  checked={legalData.fatcaDeclaration}
                  onChange={(e) => setLegalData({...legalData, fatcaDeclaration: e.target.checked})}
                  required
                />
                <label htmlFor="fatcaDeclaration">
                  I hereby declare that I am not a US citizen and that I am not considered a US tax resident for federal tax purposes (FATCA Act).
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS WITH FINAL REGISTRATION CONDITION */}
        <div className="form-actions">
          {currentStep > 2 && (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button type="submit" className="btn-primary">
            {currentStep === 4 ? "Register" : "Next"}
          </button>
        </div>
      </form>  
    </div>
  );
}