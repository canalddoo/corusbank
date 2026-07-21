"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./dashboard.css";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return ( 
    <div className="b99-master-container">
      
      {/* DESKTOP HEADER */}
      <header className="b99-desktop-header desktop-only">
        <div className="b99-top-utility-bar">
          <div className="b99-brand-logo-zone">
            <div className="b99-logo-yellow-box">
              
               <Link href="/dashboard">
              <img src="/img/logo.png" alt="Logo" style={{ cursor: "pointer" }} />
            </Link>
            </div>
            
          </div>
           
          <div className="b99-top-right-actions">
            {/* <button className="utility-link"><i className="fa-solid fa-magnifying-glass"></i> Search</button> */}
           
            <div className="user-profile-pill">
              <i className="fa-regular fa-circle-user text-large"></i>
              <span>{user ? `${user.firstname} ${user.lastname}` : "User"}</span>
            </div>
            <button onClick={logout} className="logout-action-btn">
              <i className="fa-solid fa-power-off"></i> Log out
            </button>
          </div>
        </div>

        {/* YELLOW NAVIGATION BAR */}
        <nav className="b99-desktop-navbar">
          <Link href="/dashboard" className={pathname === "/dashboard" ? "nav-item active" : "nav-item"}>
            <i className="fa-solid fa-house"></i> My Home
          </Link>
          <Link href="/dashboard/finance" className={pathname === "/dashboard/finance" ? "nav-item active" : "nav-item"}>
            <i className="fa-solid fa-wallet"></i> Finances
          </Link>
          <Link href="/dashboard/cartes" className="nav-item">
            <i className="fa-solid fa-credit-card"></i> Cards 
          </Link>
          <Link href="/dashboard/details" className="nav-item">
            <i className="fa-solid fa-gears"></i> Details 
          </Link>
        </nav>
      </header>

      {/* MOBILE HEADER */}
      <header className="b99-mobile-header mobile-only">
        <div className="mobile-header-left">
          <button className="mobile-action-trigger"><i className="fa-solid fa-chevron-left"></i></button>
          <button className="mobile-action-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div> 
        
        <div className="mobile-header-right">
          <button className="mobile-icon-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
          <button className="mobile-icon-btn"><i className="fa-solid fa-bell"></i></button>
          <Link href="/dashboard/details" passHref>
  <button className="mobile-icon-btn">
    <i className="fa-regular fa-circle-user"></i>
  </button> 
</Link>
          <button onClick={logout} className="mobile-icon-btn"><i className="fa-solid fa-power-off"></i></button>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <nav className={`b99-mobile-drawer ${isMenuOpen ? "drawer-open" : ""}`}>
          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>My Home</Link>
          <Link href="/dashboard/finance" onClick={() => setIsMenuOpen(false)}>Finances</Link>
          <Link href="/dashboard/cartes" onClick={() => setIsMenuOpen(false)}>Cards</Link>
          <Link href="/dashboard/details" onClick={() => setIsMenuOpen(false)}>Details</Link>
        </nav>
      </header>

      {/* MOBILE SUB-NAV TABS */}
      <div className="b99-mobile-sub-tabs mobile-only">
        <span className="sub-tab-link muted">History</span>
        <span className="sub-tab-link active-yellow">Checking Account</span>
      </div>

      {/* CENTRAL CONTENT VIEWPORT */}
      <main className="b99-main-viewport">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}