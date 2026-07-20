"use client";

import { useState } from "react";

export default function RegisterForm() {
  // Stappen lopen van 2 tot 4 (2: Persoonlijk, 3: Financiën, 4: Juridisch)
  const [currentStep, setCurrentStep] = useState<2 | 3 | 4>(2);

  // Status Stap 2: Persoonlijke gegevens
  const [personalData, setPersonalData] = useState({
    title1: "",
    title2: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    birthCountry: "",
    nationality: "",
    otherNationalities: "Nee",
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

  // Status Stap 3: Financiële gegevens
  const [financialData, setFinancialData] = useState({
    monthlyNetIncome: "",
    monthlyDeposits: "",
    incomeSources: [] as string[],
    hasCar: "Nee",
    housingStatus: "",
    dependentChildren: "",
    professionalGroup: "",
    industry: "",
    foreignPayments: "Nee",
    openingReason: "",
    taxResidence: "Uitsluitend Oostenrijk",
    usLinks: "Nee"
  });

  // Status Stap 4: Juridische aspecten
  const [legalData, setLegalData] = useState({
    acceptTerms: false,
    pepStatus: "Nee",
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
      // Finale stap 4: Verzending naar de backend-server
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalData, financialData, legalData }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert("Registratie succesvol afgerond en opgeslagen!");
          // Optioneel: Doorverwijzing naar dashboard of inloggen
          // window.location.href = "/nl/login";
        } else {
          alert(data.error || "Er is een fout opgetreden bij de validatie.");
        }
      } catch (error) {
        console.error("Netwerkfout:", error);
        alert("Verbinding met de server mislukt.");
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
      {/* 1. VISUELE VOORTGANGSINICATOR (4 STAPPEN) */}
      <div className="progress-stepper">
        <div className="step-item completed">
          <div className="step-circle"><i className="fa-solid fa-check"></i></div>
          <span>1. Productselectie</span>
        </div>
        <div className={`step-item ${currentStep === 2 ? "active" : "completed"}`}>
          <div className="step-circle">{currentStep > 2 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>2. Persoonlijk</span>
        </div>
        <div className={`step-item ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep > 3 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>3. Financiën</span>
        </div>
        <div className={`step-item ${currentStep === 4 ? "active" : ""}`}>
          <div className="step-circle"></div>
          <span>4. Juridisch</span>
        </div>
      </div>

      {/* HOOFDFORMULIER */}
      <form onSubmit={handleNext} className="register-card">
        
        {/* ==============================================
            STAP 2: PERSOONLIJKE GEGEVENS
            ============================================== */}
        {currentStep === 2 && (
          <div className="form-section animate-fade">
            <h2>Persoonlijke gegevens</h2>
            
            <div className="form-group row-flex">
              <label className="main-label">Titel</label>
              <div className="inputs-container split-2">
                <select 
                  value={personalData.title1} 
                  onChange={(e) => setPersonalData({...personalData, title1: e.target.value})}
                  required
                >
                  <option value="">Selecteer a.u.b....</option>
                  <option value="Dhr.">Dhr.</option>
                  <option value="Mevr.">Mevr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Ir. / Dr.">Ir. / Dr.</option>
                </select>
                <select 
                  value={personalData.title2} 
                  onChange={(e) => setPersonalData({...personalData, title2: e.target.value})}
                >
                  <option value="">Selecteer a.u.b....</option>
                  <option value="Drs.">Drs.</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Voornaam / Voornamen *</label>
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
              <label className="main-label">Achternaam *</label>
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
              <label className="main-label">Geboortedatum *</label>
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
              <label className="main-label">Geboorteland *</label>
              <div className="inputs-container has-info">
                <select 
                  value={personalData.birthCountry} 
                  onChange={(e) => setPersonalData({...personalData, birthCountry: e.target.value})}
                  required
                >
                  <option value="">Selecteer a.u.b.</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albanië">Albanië</option>
                  <option value="Algerije">Algerije</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua en Barbuda">Antigua en Barbuda</option>
                  <option value="Argentinië">Argentinië</option>
                  <option value="Armenië">Armenië</option>
                  <option value="Australië">Australië</option>
                  <option value="Bahama's">Bahama's</option>
                  <option value="Bahrein">Bahrein</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="België">België</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnië en Herzegovina">Bosnië en Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brspaceil">Brazilië</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgarije">Bulgarije</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodja">Cambodja</option>
                  <option value="Canada">Canada</option>
                  <option value="Chili">Chili</option>
                  <option value="China">China</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoren">Comoren</option>
                  <option value="Congo (Brazzaville)">Congo (Brazzaville)</option>
                  <option value="Congo (Kinshasa)">Congo (Kinshasa)</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Denemarken">Denemarken</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominicaanse Republiek">Dominicaanse Republiek</option>
                  <option value="Duitsland">Duitsland</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypte">Egypte</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatoriaal-Guinea">Equatoriaal-Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estland">Estland</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopië">Ethiopië</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Filipijnen">Filipijnen</option>
                  <option value="Finland">Finland</option>
                  <option value="Frankrijk">Frankrijk</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgië">Georgië</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Griekenland">Griekenland</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haïti">Haïti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hongarije">Hongarije</option>
                  <option value="Ierland">Ierland</option>
                  <option value="IJsland">IJsland</option>
                  <option value="India">India</option>
                  <option value="Indonesië">Indonesië</option>
                  <option value="Irak">Irak</option>
                  <option value="Iran">Iran</option>
                  <option value="Israël">Israël</option>
                  <option value="Italië">Italië</option>
                  <option value="Ivoorkust">Ivoorkust</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jemen">Jemen</option>
                  <option value="Jordanië">Jordanië</option>
                  <option value="Kaapverdië">Kaapverdië</option>
                  <option value="Kameroen">Kameroen</option>
                  <option value="KAZACHSTAN">Kazachstan</option>
                  <option value="Kenia">Kenia</option>
                  <option value="Kirgizië">Kirgizië</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Koeweit">Koeweit</option>
                  <option value="Kroatië">Kroatië</option>
                  <option value="Laos">Laos</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Letland">Letland</option>
                  <option value="Libanon">Libanon</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libië">Libië</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Litouwen">Litouwen</option>
                  <option value="Luxemburg">Luxemburg</option>
                  <option value="Madagaskar">Madagaskar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malediven">Malediven</option>
                  <option value="Maleisië">Maleisië</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marokko">Marokko</option>
                  <option value="Marshalleilanden">Marshalleilanden</option>
                  <option value="Mauritanië">Mauritanië</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesië">Micronesië</option>
                  <option value="Moldavië">Moldavië</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolië">Mongolië</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibië">Namibië</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nederland">Nederland</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Nieuw-Zeeland">Nieuw-Zeeland</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Noord-Korea">Noord-Korea</option>
                  <option value="Noord-Macedonië">Noord-Macedonië</option>
                  <option value="Noorwegen">Noorwegen</option>
                  <option value="Oeganda">Oeganda</option>
                  <option value="Oekraïne">Oekraïne</option>
                  <option value="Oezbekistan">Oezbekistan</option>
                  <option value="Oman">Oman</option>
                  <option value="Oostenrijk">Oostenrijk</option>
                  <option value="Oost-Timor">Oost-Timor</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestina">Palestina</option>
                  <option value="Panama">Panama</option>
                  <option value="Papoea-Nieuw-Guinea">Papoea-Nieuw-Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Polen">Polen</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Roemenië">Roemenië</option>
                  <option value="Rusland">Rusland</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts en Nevis">Saint Kitts en Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent en de Grenadines">Saint Vincent en de Grenadines</option>
                  <option value="Salomoneilanden">Salomoneilanden</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="São Tomé en Príncipe">São Tomé en Príncipe</option>
                  <option value="Saoedi-Arabië">Saoedi-Arabië</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Servië">Servië</option>
                  <option value="Seychellen">Seychellen</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovenië">Slovenië</option>
                  <option value="Slowakije">Slowakije</option>
                  <option value="Soedan">Soedan</option>
                  <option value="Somalië">Somalië</option>
                  <option value="Spanje">Spanje</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Syrië">Syrië</option>
                  <option value="Tadzjikistan">Tadzjikistan</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad en Tobago">Trinidad en Tobago</option>
                  <option value="Tsjaad">Tsjaad</option>
                  <option value="Tsjechië">Tsjechië</option>
                  <option value="Tunesië">Tunesië</option>
                  <option value="Turkije">Turkije</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vaticaanstad">Vaticaanstad</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Verenigde Arabische Emiraten">Verenigde Arabische Emiraten</option>
                  <option value="Verenigd Koninkrijk">Verenigd Koninkrijk</option>
                  <option value="Verenigde Staten">Verenigde Staten</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Wit-Rusland">Wit-Rusland</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Zuid-Afrika">Zuid-Afrika</option>
                  <option value="Zuid-Korea">Zuid-Korea</option>
                  <option value="Zuid-Soedan">Zuid-Soedan</option>
                  <option value="Zweden">Zweden</option>
                  <option value="Zwitserland">Zwitserland</option>
                </select>
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Andere nationaliteiten toevoegen? *</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="otherNationalities" 
                    value="Nee" 
                    checked={personalData.otherNationalities === "Nee"} 
                    onChange={(e) => setPersonalData({...personalData, otherNationalities: e.target.value})} 
                  /> Nee
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="otherNationalities" 
                    value="Ja" 
                    checked={personalData.otherNationalities === "Ja"} 
                    onChange={(e) => setPersonalData({...personalData, otherNationalities: e.target.value})} 
                  /> Ja
                </label>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Burgerlijke staat *</label>
              <div className="inputs-container">
                <select 
                  value={personalData.civilStatus} 
                  onChange={(e) => setPersonalData({...personalData, civilStatus: e.target.value})}
                  required
                >
                  <option value="">Selecteer a.u.b.</option>
                  <option value="Ongehuwd">Ongehuwd</option>
                  <option value="Gehuwd">Gehuwd</option>
                  <option value="Gescheiden">Gescheiden</option>
                  <option value="Weduwe/Weduwnaar">Weduwe/Weduwnaar</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Telefonisch wachtwoord *</label>
              <div className="inputs-container vertical-stack">
                <input 
                  type="password" 
                  value={personalData.phonePassword} 
                  onChange={(e) => setPersonalData({...personalData, phonePassword: e.target.value})} 
                  required 
                />
                <div className="info-box-gray">
                  Het telefonisch wachtwoord is nodig voor legitimatie bij telefonische inlichtingen en aanvragen.
                </div>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Officieel adres</h3>

            <div className="form-group row-flex">
              <label className="main-label">Straat en huisnummer *</label>
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
              <label className="main-label">Postcode / Plaats *</label>
              <div className="inputs-container split-zip">
                <input 
                  type="text" 
                  placeholder="Postcode" 
                  value={personalData.postalCode} 
                  onChange={(e) => setPersonalData({...personalData, postalCode: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Plaats" 
                  value={personalData.city} 
                  onChange={(e) => setPersonalData({...personalData, city: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Contactgegevens</h3>

            <div className="form-group row-flex">
              <label className="main-label">Mobiel telefoonnummer *</label>
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
              <label className="main-label">E-mailadres *</label>
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
                  Corusbank stuurt mij precontractuele en contractuele informatie over het aangevraagde product naar het door mij opgegeven e-mailadres. Ik bevestig hierbij de juistheid ervan.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            STAP 3: FINANCIËLE GEGEVENS
            ============================================== */}
        {currentStep === 3 && (
          <div className="form-section animate-fade">
            <h2>Financiële gegevens</h2>

            <div className="form-group row-flex">
              <label className="main-label">Maandelijks netto-inkomen *</label>
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
              <label className="main-label">Maandelijkse bijschrijvingen *</label>
              <div className="inputs-container">
                <select 
                  value={financialData.monthlyDeposits}
                  onChange={(e) => setFinancialData({...financialData, monthlyDeposits: e.target.value})}
                  required
                >
                  <option value="">Selecteer a.u.b.</option>
                  <option value="tot 1.000 EUR">tot 1.000 EUR</option>
                  <option value="1.001 EUR - 1.500 EUR">1.001 EUR - 1.500 EUR</option>
                  <option value="1.501 EUR - 2.000 EUR">1.501 EUR - 2.000 EUR</option>
                  <option value="2.001 EUR - 2.500 EUR">2.001 EUR - 2.500 EUR</option>
                  <option value="2.501 EUR - 3.000 EUR">2.501 EUR - 3.000 EUR</option>
                  <option value="3.001 EUR - 3.500 EUR">3.001 EUR - 3.500 EUR</option>
                  <option value="3.501 EUR - 4.000 EUR">3.501 EUR - 4.000 EUR</option>
                  <option value="4.001 EUR - 4.500 EUR">4.001 EUR - 4.500 EUR</option>
                  <option value="4.501 EUR - 5.000 EUR">4.501 EUR - 5.000 EUR</option>
                  <option value="meer dan 5.000 EUR">meer dan 5.000 EUR</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Waar komt uw huidige inkomen vandaan?</label>
              <div className="inputs-container checkbox-list">
                {[
                  "Salaris/Loon (Werknemer)", "Zelfstandige activiteit", 
                  "Wettelijk of privépensioen / Verzekeringsuitkeringen", 
                  "Inkomsten uit sociale uitkeringen", "Inkomsten van de (echt)genoot/partner", 
                  "Echtscheidingsovereenkomst, Alimentatie", "Kapitaalopbrengsten / Rendement uit investeringen", 
                  "Vermogen", "Studiebeurs", "Loterijwinster", "Uitkeringen uit stichtingen", "Geen inkomen"
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
            <h3>Maandelijkse uitgaven</h3>

            <div className="form-group row-flex">
              <label className="main-label">Bezit u een auto?</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="hasCar" 
                    value="Nee"
                    checked={financialData.hasCar === "Nee"}
                    onChange={(e) => setFinancialData({...financialData, hasCar: e.target.value})}
                  /> Nee
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="hasCar" 
                    value="Ja"
                    checked={financialData.hasCar === "Ja"}
                    onChange={(e) => setFinancialData({...financialData, hasCar: e.target.value})}
                  /> Ja
                </label>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Woonsituatie</label>
              <div className="inputs-container">
                <select 
                  value={financialData.housingStatus}
                  onChange={(e) => setFinancialData({...financialData, housingStatus: e.target.value})}
                >
                  <option value="">Selecteer a.u.b.</option>
                  <option value="Bij de ouders">Bij de ouders</option>
                  <option value="Eigendom (Huis)">Eigendom (Huis)</option>
                  <option value="Koopappartement">Koopappartement</option>
                  <option value="Huurwoning">Huurwoning</option>
                </select>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Fiscale woonplaats</h3>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Belastingplicht buiten Oostenrijk?</label>
              <div className="inputs-container vertical-radio-list">
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Uitsluitend Oostenrijk"
                    checked={financialData.taxResidence === "Uitsluitend Oostenrijk"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> Ik ben uitsluitend belastingplichtig in Oostenrijk.
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Andere landen"
                    checked={financialData.taxResidence === "Andere landen"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> Ik ben ook belastingplichtig in een ander land.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            STAP 4: JURIDISCHE ASPECTEN
            ============================================== */}
        {currentStep === 4 && (
          <div className="form-section animate-fade">
            <h2>Juridische aspecten</h2>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Politiek Prominent Persoon (PEP)</label>
              <div className="inputs-container vertical-radio-list">
                <label>
                  <input 
                    type="radio" 
                    name="pepStatus" 
                    value="Nee"
                    checked={legalData.pepStatus === "Nee"}
                    onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                  /> Ik ben noch een Politiek Prominent Persoon (PEP), noch een familielid of nauwe relatie daarvan.
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="pepStatus" 
                    value="Ja"
                    checked={legalData.pepStatus === "Ja"}
                    onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                  /> Ik ben een Politiek Prominent Persoon of een familielid/nauwe relatie daarvan.
                </label>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="form-group row-flex alignment-top">
              <label className="main-label">FATCA-verklaring</label>
              <div className="inputs-container checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="fatcaDeclaration"
                  checked={legalData.fatcaDeclaration}
                  onChange={(e) => setLegalData({...legalData, fatcaDeclaration: e.target.checked})}
                  required
                />
                <label htmlFor="fatcaDeclaration">
                  Ik bevestig dat ik geen Amerikaanse staatsburger ben en niet belastingplichtig ben in de Verenigde Staten.
                </label>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Algemene Voorwaarden *</label>
              <div className="inputs-container checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  checked={legalData.acceptTerms}
                  onChange={(e) => setLegalData({...legalData, acceptTerms: e.target.checked})}
                  required
                />
                <label htmlFor="acceptTerms">
                  Ik accepteer de Algemene Voorwaarden en de privacyverklaring van CorusBank.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ACTIEKNOPPEN VOOR HET FORMULIER */}
        <div className="form-actions">
          {currentStep > 2 && (
            <button type="button" onClick={handleBack} className="btn-secondary">
              <i className="fa-solid fa-arrow-left"></i> Vorige
            </button>
          )}
          <button type="submit" className="btn-primary">
            {currentStep === 4 ? "Aanvraag indienen" : "Volgende"} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

      </form>
    </div>
  );
}