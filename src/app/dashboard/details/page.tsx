"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface UserProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  iban: string; // <-- Added IBAN property received from the DB
}

export default function AccountDetailsPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch("/api/user/details");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          setError("Unable to load your user data.");
        }
      } catch (err) {
        setError("Network error while communicating with the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const bankBic = "SPBAATWWXXX";
  const displayIban = profile?.iban || "Not provided";

  if (loading) {
    return (
      <div className="b99-details-container" style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#777" }}>Loading your secured information...</p>
      </div>
    );
  }

  return (
    <div className="b99-view-wrapper b99-details-container">
      {/* PAGE BANNER */}
      <div className="b99-finance-banner b99-details-banner">
        <div className="b99-details-banner-content">
          <div>
            <h2>Account Details & Personal Information</h2>
            <p>View your profile data retrieved from our secure database.</p>
          </div>
          <Link href="/dashboard" className="outline-action-dark-btn b99-details-back-btn">
            <i className="fa-solid fa-arrow-left"></i> Back to dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fde8e8", color: "#e53e3e", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="b99-details-grid">
        
        {/* COMPONENT: USER PROFILE */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i> User Profile
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">Last Name</span>
              <strong className="b99-details-value text-uppercase">
                {profile?.lastname || "Not provided"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">First Name</span>
              <strong className="b99-details-value">
                {profile?.firstname || "Not provided"}
              </strong>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">Registered Email Address</span>
              <strong className="b99-details-value text-blue">
                {profile?.email || "Not provided"}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Account Status</span>
              <span className="b99-details-status-tag">
                <span className="b99-details-status-dot"></span> Verified & Active
              </span>
            </div>

          </div>
        </div>

        {/* COMPONENT: OFFICIAL BANKING DETAILS */}
        <div className="b99-card-panel">
          <div className="gray-header-strip-title">
            <i className="fa-solid fa-building-columns" style={{ marginRight: "8px" }}></i> Official Banking Details
          </div>
          <div className="panel-inner-padding b99-details-fields-list">
            
            <div className="b99-details-field-item">
              <span className="b99-details-label">IBAN Number</span>
              <div className="b99-details-copy-box">
                {/* <code>{displayIban}</code> */}
                <code>{displayIban}</code>
                {profile?.iban && profile.iban !== "Not configured" && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(displayIban); alert("IBAN copied to clipboard!"); }} 
                    title="Copy IBAN"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="b99-details-field-item">
              <span className="b99-details-label">BIC / SWIFT Code</span>
              <strong className="b99-details-value tracking-wide">
                {bankBic}
              </strong>
            </div>

            <div className="b99-details-field-item no-border">
              <span className="b99-details-label">Account Type</span>
              <strong className="b99-details-value">
                Checking Account 
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* SECURITY NOTICE */}
      <div className="b99-card-panel b99-details-security-notice">
        <div className="panel-inner-padding b99-details-security-content">
          <div className="b99-details-security-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <strong>Data Integrity and Security</strong>
            <p>
              This information comes directly from your secure registration file. For any regulatory changes to your identity details, please submit a signed request along with official proof to your assigned advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}