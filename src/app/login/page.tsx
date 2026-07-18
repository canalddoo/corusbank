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
        throw new Error(data.error || "Une erreur est survenue lors de la connexion.");
      }

      if (data.success) {
        console.log("Utilisateur connecté avec succès :", data.user);
        router.push("/dashboard");
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
        
        {/* EN-TÊTE DE LA CARTE */}
        <div className="card-header">
          <Link href="/" className="back-button" aria-label="Retour à l'accueil">
            <i className="fa-solid fa-house"></i>
          </Link>
          <h2>Se connecter</h2>
        </div>

        {/* CONTENU DE LA CARTE */}
        <div className="card-body">
          <p className="welcome-text">
            Bonjour de la part des services bancaires en ligne de CorusBank ! :-)
          </p>

          {/* AFFICHAGE DES ERREURS */}
          {error && <div className="login-error-message">{error}</div>}

          {/* FORMULAIRE UNIQUE AVEC LES DEUX CHAMPS VISIBLES */}
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* CHAMP 1 : ADRESSE E-MAIL */}
            <div className="input-group-header">
              <label htmlFor="username">adresse e-mail</label>
              
            </div>
            <input
              type="email"
              id="username"
              placeholder="exemple@domaine.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />

            {/* CHAMP 2 : MOT DE PASSE */}
            <div className="input-group-header" style={{ marginTop: "15px" }}>
              <label htmlFor="password">mot de passe</label>
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

            {/* BOUTON DE SOUMISSION */}
            <button type="submit" className="btn-yellow-submit" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {/* LIENS DE RÉCUPÉRATION */}
            <div className="form-footer-link" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <a href="#">Nom d'utilisateur oublié ?</a>
              <a href="#">Mot de passe oublié ?</a>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}