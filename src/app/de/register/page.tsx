"use client";

import { useState } from "react";

export default function RegisterForm() {
  // Schritte reichen jetzt von 2 bis 4 (2: Persönliches, 3: Finanzen, 4: Rechtliches)
  const [currentStep, setCurrentStep] = useState<2 | 3 | 4>(2);

  // Zustand Schritt 2: Persönliche Daten
  const [personalData, setPersonalData] = useState({
    title1: "",
    title2: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    birthCountry: "",
    nationality: "",
    otherNationalities: "Nein",
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

  // Zustand Schritt 3: Finanzielle Daten
  const [financialData, setFinancialData] = useState({
    monthlyNetIncome: "",
    monthlyDeposits: "",
    incomeSources: [] as string[],
    hasCar: "Nein",
    housingStatus: "",
    dependentChildren: "",
    professionalGroup: "",
    industry: "",
    foreignPayments: "Nein",
    openingReason: "",
    taxResidence: "Ausschließlich Österreich",
    usLinks: "Nein"
  });

  // Zustand Schritt 4: Rechtliche Aspekte
  const [legalData, setLegalData] = useState({
    acceptTerms: false,
    pepStatus: "Nein",
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
      // Finaler Schritt 4: Übermittlung an den Backend-Server
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalData, financialData, legalData }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert("Registrierung erfolgreich abgeschlossen und gespeichert!");
          // Optional: Weiterleitung zum Dashboard oder Login
          // window.location.href = "/de/login";
        } else {
          alert(data.error || "Bei der Validierung ist ein Fehler aufgetreten.");
        }
      } catch (error) {
        console.error("Netzwerkfehler:", error);
        alert("Server verbindung fehlgeschlagen.");
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
      {/* 1. ANGEPASSTE VISUELLE FORTSCHRITTSANZEIGE (4 SCHRITTE) */}
      <div className="progress-stepper">
        <div className="step-item completed">
          <div className="step-circle"><i className="fa-solid fa-check"></i></div>
          <span>1. Produktauswahl</span>
        </div>
        <div className={`step-item ${currentStep === 2 ? "active" : "completed"}`}>
          <div className="step-circle">{currentStep > 2 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>2. Persönliches</span>
        </div>
        <div className={`step-item ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep > 3 ? <i className="fa-solid fa-check"></i> : null}</div>
          <span>3. Finanzen</span>
        </div>
        <div className={`step-item ${currentStep === 4 ? "active" : ""}`}>
          <div className="step-circle"></div>
          <span>4. Rechtliches</span>
        </div>
      </div>

      {/* HAUPTFORMULAR */}
      <form onSubmit={handleNext} className="register-card">
        
        {/* ==============================================
            SCHRITT 2: PERSÖNLICHE DATEN
            ============================================== */}
        {currentStep === 2 && (
          <div className="form-section animate-fade">
            <h2>Persönliche Daten</h2>
            
            <div className="form-group row-flex">
              <label className="main-label">Titel</label>
              <div className="inputs-container split-2">
                <select 
                  value={personalData.title1} 
                  onChange={(e) => setPersonalData({...personalData, title1: e.target.value})}
                  required
                >
                  <option value="">Bitte auswählen...</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                  <option value="Prof.">Prof.</option>
                  <option value="DI Mag. (FH)">DI Mag. (FH)</option>
                </select>
                <select 
                  value={personalData.title2} 
                  onChange={(e) => setPersonalData({...personalData, title2: e.target.value})}
                >
                  <option value="">Bitte auswählen...</option>
                  <option value="MPS">MPS</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Vorname(n) *</label>
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
              <label className="main-label">Nachname *</label>
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
              <label className="main-label">Geburtsdatum *</label>
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
              <label className="main-label">Geburtsland *</label>
              <div className="inputs-container has-info">
                <select 
                  value={personalData.birthCountry} 
                  onChange={(e) => setPersonalData({...personalData, birthCountry: e.target.value})}
                  required
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Ägypten">Ägypten</option>
                  <option value="Albanien">Albanien</option>
                  <option value="Algerien">Algerien</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua und Barbuda">Antigua und Barbuda</option>
                  <option value="Äquatorialguinea">Äquatorialguinea</option>
                  <option value="Argentinien">Argentinien</option>
                  <option value="Armenien">Armenien</option>
                  <option value="Aserbaidschan">Aserbaidschan</option>
                  <option value="Äthiopien">Äthiopien</option>
                  <option value="Australien">Australien</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesch">Bangladesch</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belgien">Belgien</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivien">Bolivien</option>
                  <option value="Bosnien und Herzegowina">Bosnien und Herzegowina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brasilien">Brasilien</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgarien">Bulgarien</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Dänemark">Dänemark</option>
                  <option value="Deutschland">Deutschland</option>
                  <option value="Dominika">Dominika</option>
                  <option value="Dominikanische Republik">Dominikanische Republik</option>
                  <option value="Dschibuti">Dschibuti</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Elfenbeinküste">Elfenbeinküste</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estland">Estland</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Fidschi">Fidschi</option>
                  <option value="Finnland">Finnland</option>
                  <option value="Frankreich">Frankreich</option>
                  <option value="Gabun">Gabun</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgien">Georgien</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Griechenland">Griechenland</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Indien">Indien</option>
                  <option value="Indonesien">Indonesien</option>
                  <option value="Irak">Irak</option>
                  <option value="Iran">Iran</option>
                  <option value="Irland">Irland</option>
                  <option value="Island">Island</option>
                  <option value="Israel">Israel</option>
                  <option value="Italien">Italien</option>
                  <option value="Jamaika">Jamaika</option>
                  <option value="Japan">Japan</option>
                  <option value="Jemen">Jemen</option>
                  <option value="Jordanien">Jordanien</option>
                  <option value="Kambodscha">Kambodscha</option>
                  <option value="Kamerun">Kamerun</option>
                  <option value="Kanada">Kanada</option>
                  <option value="Kap Verde">Kap Verde</option>
                  <option value="Kasachstan">Kasachstan</option>
                  <option value="Katar">Katar</option>
                  <option value="Kenia">Kenia</option>
                  <option value="Kirgisistan">Kirgisistan</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Kolumbien">Kolumbien</option>
                  <option value="Komoren">Komoren</option>
                  <option value="Kongo (Brazzaville)">Kongo (Brazzaville)</option>
                  <option value="Kongo (Kinshasa)">Kongo (Kinshasa)</option>
                  <option value="Kroatien">Kroatien</option>
                  <option value="Kuba">Kuba</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Laos">Laos</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Lettland">Lettland</option>
                  <option value="Libanon">Libanon</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libyen">Libyen</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Litauen">Litauen</option>
                  <option value="Luxemburg">Luxemburg</option>
                  <option value="Madagaskar">Madagaskar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Malediven">Malediven</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marokko">Marokko</option>
                  <option value="Marshallinseln">Marshallinseln</option>
                  <option value="Mauretanien">Mauretanien</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexiko">Mexiko</option>
                  <option value="Mikronesien">Mikronesien</option>
                  <option value="Moldau">Moldau</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolei">Mongolei</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Mosambik">Mosambik</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Neuseeland">Neuseeland</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niederlande">Niederlande</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Nordmazedonien">Nordmazedonien</option>
                  <option value="Nordkorea">Nordkorea</option>
                  <option value="Norwegen">Norwegen</option>
                  <option value="Oman">Oman</option>
                  <option value="Österreich">Österreich</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palästina">Palästina</option>
                  <option value="Palau">Palau</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua-Neuguinea">Papua-Neuguinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippinen">Philippinen</option>
                  <option value="Polen">Polen</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Ruanda">Ruanda</option>
                  <option value="Rumänien">Rumänien</option>
                  <option value="Russland">Russland</option>
                  <option value="Salomonen">Salomonen</option>
                  <option value="Sambia">Sambia</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="São Tomé und Príncipe">São Tomé und Príncipe</option>
                  <option value="Saudi-Arabien">Saudi-Arabien</option>
                  <option value="Schweden">Schweden</option>
                  <option value="Schweiz">Schweiz</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbien">Serbien</option>
                  <option value="Seychellen">Seychellen</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Simbabwe">Simbabwe</option>
                  <option value="Singapur">Singapur</option>
                  <option value="Slowakei">Slowakei</option>
                  <option value="Slowenien">Slowenien</option>
                  <option value="Somalia">Somalia</option>
                  <option value="Spanien">Spanien</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="St. Kitts und Nevis">St. Kitts und Nevis</option>
                  <option value="St. Lucia">St. Lucia</option>
                  <option value="St. Vincent und die Grenadinen">St. Vincent und die Grenadinen</option>
                  <option value="Südafrika">Südafrika</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Südkorea">Südkorea</option>
                  <option value="Südsudan">Südsudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Syrien">Syrien</option>
                  <option value="Tadschikistan">Tadschikistan</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tansania">Tansania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Osttimor">Osttimor</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad und Tobago">Trinidad und Tobago</option>
                  <option value="Tschad">Tschad</option>
                  <option value="Tschechien">Tschechien</option>
                  <option value="Tunesien">Tunesien</option>
                  <option value="Türkei">Türkei</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="Ungarn">Ungarn</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="USA">USA</option>
                  <option value="Usbekistan">Usbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatikanstadt">Vatikanstadt</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vereinigte Arabische Emirate">Vereinigte Arabische Emirate</option>
                  <option value="Vereinigtes Königreich">Vereinigtes Königreich</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Zentralafrikanische Republik">Zentralafrikanische Republik</option>
                  <option value="Zypern">Zypern</option>
                </select>
                <i className="fa-solid fa-circle-info info-icon"></i>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Weitere Staatsangehörigkeiten hinzufügen? *</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="otherNationalities" 
                    value="Nein" 
                    checked={personalData.otherNationalities === "Nein"} 
                    onChange={(e) => setPersonalData({...personalData, otherNationalities: e.target.value})} 
                  /> Nein
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
              <label className="main-label">Familienstand *</label>
              <div className="inputs-container">
                <select 
                  value={personalData.civilStatus} 
                  onChange={(e) => setPersonalData({...personalData, civilStatus: e.target.value})}
                  required
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Ledig">Ledig</option>
                  <option value="Verheiratet">Verheiratet</option>
                  <option value="Geschieden">Geschieden</option>
                  <option value="Verwitwet">Verwitwet</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex">
              <label className="main-label">Telefonpasswort *</label>
              <div className="inputs-container vertical-stack">
                <input 
                  type="password" 
                  value={personalData.phonePassword} 
                  onChange={(e) => setPersonalData({...personalData, phonePassword: e.target.value})} 
                  required 
                />
                <div className="info-box-gray">
                  Das Telefonpasswort wird zur Legitimation bei telefonischen Auskünften und Anfragen benötigt.
                </div>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Meldeadresse</h3>

            <div className="form-group row-flex">
              <label className="main-label">Straße, Hausnummer *</label>
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
              <label className="main-label">PLZ / Ort *</label>
              <div className="inputs-container split-zip">
                <input 
                  type="text" 
                  placeholder="PLZ" 
                  value={personalData.postalCode} 
                  onChange={(e) => setPersonalData({...personalData, postalCode: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Ort" 
                  value={personalData.city} 
                  onChange={(e) => setPersonalData({...personalData, city: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Kontaktdaten</h3>

            <div className="form-group row-flex">
              <label className="main-label">Mobiltelefonnummer *</label>
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
              <label className="main-label">E-Mail-Adresse *</label>
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
                  Die Corusbank sendet mir vorvertragliche und vertragliche Informationen zum beantragten Produkt an die von mir angegebene E-Mail-Adresse. Ich bestätige hiermit deren Richtigkeit.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            SCHRITT 3: FINANZIELLE DATEN
            ============================================== */}
        {currentStep === 3 && (
          <div className="form-section animate-fade">
            <h2>Finanzielle Daten</h2>

            <div className="form-group row-flex">
              <label className="main-label">Monatliches Nettoeinkommen *</label>
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
              <label className="main-label">Monatlicher Kontoeingang *</label>
              <div className="inputs-container">
                <select 
                  value={financialData.monthlyDeposits}
                  onChange={(e) => setFinancialData({...financialData, monthlyDeposits: e.target.value})}
                  required
                >
                  <option value="">Bitte auswählen</option>
                  <option value="bis 1.000 EUR">bis 1.000 EUR</option>
                  <option value="1.001 EUR - 1.500 EUR">1.001 EUR - 1.500 EUR</option>
                  <option value="1.501 EUR - 2.000 EUR">1.501 EUR - 2.000 EUR</option>
                  <option value="2.001 EUR - 2.500 EUR">2.001 EUR - 2.500 EUR</option>
                  <option value="2.501 EUR - 3.000 EUR">2.501 EUR - 3.000 EUR</option>
                  <option value="3.001 EUR - 3.500 EUR">3.001 EUR - 3.500 EUR</option>
                  <option value="3.501 EUR - 4.000 EUR">3.501 EUR - 4.000 EUR</option>
                  <option value="4.001 EUR - 4.500 EUR">4.001 EUR - 4.500 EUR</option>
                  <option value="4.501 EUR - 5.000 EUR">4.501 EUR - 5.000 EUR</option>
                  <option value="über 5.000 EUR">über 5.000 EUR</option>
                </select>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Woher stammt Ihr aktuelles Einkommen?</label>
              <div className="inputs-container checkbox-list">
                {[
                  "Gehalt/Lohn (Angestellte/r)", "Selbstständige Tätigkeit", 
                  "Gesetzliche oder private Pension / Versicherungsleistungen", 
                  "Einkünfte aus Sozialleistungen", "Einkünfte des (Ehe-)Partners", 
                  "Scheidungsvereinbarung, Unterhalt", "Kapitalerträge / Rendite aus Investitionen", 
                  "Vermögen", "Stipendium", "Lottogewinn", "Zuwendungen aus Stiftungen", "Kein Einkommen"
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
            <h3>Monatliche Ausgaben</h3>

            <div className="form-group row-flex">
              <label className="main-label">Besitzen Sie ein Auto?</label>
              <div className="inputs-container radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="hasCar" 
                    value="Nein"
                    checked={financialData.hasCar === "Nein"}
                    onChange={(e) => setFinancialData({...financialData, hasCar: e.target.value})}
                  /> Nein
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
              <label className="main-label">Wohnsituation</label>
              <div className="inputs-container">
                <select 
                  value={financialData.housingStatus}
                  onChange={(e) => setFinancialData({...financialData, housingStatus: e.target.value})}
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Bei den Eltern">Bei den Eltern</option>
                  <option value="Eigentum (Haus)">Eigentum (Haus)</option>
                  <option value="Eigentumswohnung">Eigentumswohnung</option>
                  <option value="Zur Miete">Zur Miete</option>
                </select>
              </div>
            </div>

            <hr className="section-divider" />
            <h3>Steuerlicher Wohnsitz</h3>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Steuerpflicht außerhalb Österreichs?</label>
              <div className="inputs-container vertical-radio-list">
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Ausschließlich Österreich"
                    checked={financialData.taxResidence === "Ausschließlich Österreich"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> Ich bin ausschließlich in Österreich steuerpflichtig.
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="taxResidence" 
                    value="Österreich und weitere"
                    checked={financialData.taxResidence === "Österreich und weitere"}
                    onChange={(e) => setFinancialData({...financialData, taxResidence: e.target.value})}
                  /> Ich bin in Österreich und in mindestens einem weiteren Land steuerpflichtig.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================
            SCHRITT 4: RECHTLICHE ASPEKTE
            ============================================== */}
        {currentStep === 4 && (
          <div className="form-section animate-fade">
            <h2>Rechtliche Aspekte</h2>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Politisch exponierte Person (PEP) *</label>
              <div className="inputs-container vertical-stack">
                <div className="radio-group"> 
                  <label>
                    <input 
                      type="radio" 
                      name="pepStatus" 
                      value="Nein"
                      checked={legalData.pepStatus === "Nein"}
                      onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                    /> Nein
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="pepStatus" 
                      value="Ja"
                      checked={legalData.pepStatus === "Ja"}
                      onChange={(e) => setLegalData({...legalData, pepStatus: e.target.value})}
                    /> Ja
                  </label>
                </div>
                <div className="info-box-gray">
                  Sind Sie oder ein einfaches Familienmitglied eine Person, die im vergangenem Jahr ein wichtiges öffentliches Amt ausgeübt hat oder ausübt?
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="form-group row-flex alignment-top">
              <label className="main-label">Allgemeine Geschäftsbedingungen *</label>
              <div className="inputs-container checkbox-wrapper info-box-gray">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  checked={legalData.acceptTerms}
                  onChange={(e) => setLegalData({...legalData, acceptTerms: e.target.checked})}
                  required
                />
                <label htmlFor="acceptTerms">
                  <strong>Ich bestätige, die Allgemeinen Geschäftsbedingungen (AGB) gelesen und vorbehaltlos akzeptiert zu haben.</strong>
                  <p>Ich bestätige außerdem, die Informationen zur Einlagensicherung und die Datenschutzbestimmungen der Bank zur Kenntnis genommen zu haben.</p>
                </label>
              </div>
            </div>

            <div className="form-group row-flex alignment-top">
              <label className="main-label">US-Steuerstatus (FATCA) *</label>
              <div className="inputs-container checkbox-wrapper info-box-gray">
                <input 
                  type="checkbox" 
                  id="fatcaDeclaration"
                  checked={legalData.fatcaDeclaration}
                  onChange={(e) => setLegalData({...legalData, fatcaDeclaration: e.target.checked})}
                  required
                />
                <label htmlFor="fatcaDeclaration">
                  <strong>Ich bestätige, dass ich kein US-Staatsbürger bin und in den USA nicht steuerpflichtig bin.</strong>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATIONSTASTEN DES FORMULARS */}
        <div className="form-actions">
          {currentStep > 2 && (
            <button type="button" onClick={handleBack} className="btn-secondary">
              Zurück
            </button>
          )}
          <button type="submit" className="btn-primary">
            {currentStep === 4 ? "Registrierung abschließen" : "Weiter"}
          </button>
        </div>

      </form>
    </div>
  );
}