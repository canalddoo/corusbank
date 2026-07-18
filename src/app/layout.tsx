"use client";

import "./globals.css";
import "./layout.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Masquer la nav et le footer si on est sur la page de login OU sur le dashboard
// Ton ancienne condition mise à jour avec l'administration
const hideNavAndFooter = 
  pathname === "/login" || 
  pathname.startsWith("/dashboard") || 
  pathname.startsWith("/admin"); // <-- Masque la navigation et le footer sur toutes les pages admin

  return (
    <html lang="fr">
      <head>
        {/* Font Awesome pour les icônes */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        <link rel="shortcut icon" href="/img/log.png" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      {/* On ajoute l'attribut ici sur le body */}
      <body suppressHydrationWarning={true}>
        {!hideNavAndFooter && <Navbar />}
        <main>{children}</main>
        {!hideNavAndFooter && <Footer />}
      </body>
    </html>
  );
}