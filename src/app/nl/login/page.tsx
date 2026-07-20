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
        throw new Error(data.error || "Er is een fout opgetreden bij het inloggen.");
      }

      if (data.success) {
        console.log("Gebruiker succesvol ingelogd:", data.user);
        router.push("/nl/dashboard");
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
        
        {/* KAART-KOPTEKST */}
        <div className="card-header">
          <Link href="/nl" className="back-button" aria-label="Terug naar de startpagina">
            <i className="fa-solid fa-house"></i>
          </Link>
          <h2>Inloggen</h2>
        </div>

        {/* KAART-INHOUD */}
        <div className="card-body">
          <p className="welcome-text">
            Welkom bij online bankieren van CorusBank! :-)
          </p>

          {/* FOUTMELDING */}
          {error && <div className="login-error-message">{error}</div>}

          {/* FORMULIER */}
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* VELD 1: E-MAILADRES */}
            <div className="input-group-header">
              <label htmlFor="username">E-mailadres</label>
            </div>
            <input
              type="email"
              id="username"
              placeholder="voorbeeld@domein.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />

            {/* VELD 2: WACHTWOORD */}
            <div className="input-group-header" style={{ marginTop: "15px" }}>
              <label htmlFor="password">Wachtwoord</label>
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

            {/* SUBMIT KNOP */}
            <button type="submit" className="btn-yellow-submit" disabled={isLoading}>
              {isLoading ? "Inloggen bezig..." : "Inloggen"}
            </button>

            {/* HERSTEL-LINKS */}
            <div className="form-footer-link" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <a href="#">Gebruikersnaam vergeten?</a>
              <a href="#">Wachtwoord vergeten?</a>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}