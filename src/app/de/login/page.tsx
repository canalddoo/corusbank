"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          phonePassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Beim Anmelden ist ein Fehler aufgetreten.");
      }

      if (data.success) {
        console.log("Benutzer erfolgreich angemeldet:", data.user);
        router.push("/de/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        
        {/* KARTEN-KOPFZEILE */}
        <div className="card-header">
          <Link href="/de" className="back-button" aria-label="Zurück zur Startseite">
            <i className="fa-solid fa-house"></i>
          </Link>
          <h2>Anmelden</h2>
        </div>

        {/* KARTEN-INHALT */}
        <div className="card-body">
          <p className="welcome-text">
            Willkommen beim Online-Banking von CorusBank! :-)
          </p>

          {/* FEHLERANZEIGE */}
          {error && <div className="login-error-message">{error}</div>}

          {/* FORMULAR */}
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* FELD 1: E-MAIL-ADRESSE */}
            <div className="input-group-header">
              <label htmlFor="username">E-Mail-Adresse</label>
            </div>
            <input
              type="email"
              id="username"
              placeholder="beispiel@domain.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />

            {/* FELD 2: PASSWORT */}
            <div className="input-group-header" style={{ marginTop: "15px" }}>
              <label htmlFor="password">Passwort</label>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn-yellow-submit" disabled={isLoading}>
              {isLoading ? "Anmeldung läuft..." : "Anmelden"}
            </button>

            {/* WIEDERHERSTELLUNGS-LINKS */}
            <div className="form-footer-link" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <a href="#">Benutzername vergessen?</a>
              <a href="#">Passwort vergessen?</a>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}