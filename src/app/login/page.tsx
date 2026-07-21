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
        throw new Error(data.error || "An error occurred during login.");
      }

      if (data.success) {
        console.log("User successfully logged in:", data.user);
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
        
        {/* CARD HEADER */}
        <div className="card-header">
          <Link href="/" className="back-button" aria-label="Back to home">
            <i className="fa-solid fa-house"></i>
          </Link>
          <h2>Log in</h2>
        </div>

        {/* CARD BODY */}
        <div className="card-body">
          <p className="welcome-text">
            Hello from CorusBank online banking! :-)
          </p>

          {/* ERROR DISPLAY */}
          {error && <div className="login-error-message">{error}</div>}

          {/* FORM WITH VISIBLE FIELDS */}
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* FIELD 1: EMAIL ADDRESS */}
            <div className="input-group-header">
              <label htmlFor="username">email address</label>
            </div>
            <input
              type="email"
              id="username"
              placeholder="example@domain.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              disabled={isLoading}
            />

            {/* FIELD 2: PASSWORD */}
            <div className="input-group-header" style={{ marginTop: "15px" }}>
              <label htmlFor="password">password</label>
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
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            {/* RECOVERY LINKS */}
            <div className="form-footer-link" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <a href="#">Forgot username?</a>
              <a href="#">Forgot password?</a>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}