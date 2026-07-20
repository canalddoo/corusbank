"use client";

import "./globals.css";
import "./layout.css";

// Import des versions Françaises
import NavbarFr from "@/components/Navbar";
import FooterFr from "@/components/Footer";

// Import des versions Allemandes
import NavbarDe from "@/components/de/Navbar";
import FooterDe from "@/components/de/Footer";

// Import des versions Néerlandaises
import NavbarNl from "@/components/nl/Navbar";
import FooterNl from "@/components/nl/Footer";

import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // 1. Détection de la langue dans l'URL
  const isGerman = pathname.startsWith("/de");
  const isDutch = pathname.startsWith("/nl");

  // 2. Masquer la nav et le footer (prend en compte /de et /nl)
  const hideNavAndFooter = 
    pathname === "/login" || 
    pathname === "/de/login" || 
    pathname === "/nl/login" || 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/de/dashboard") || 
    pathname.startsWith("/nl/dashboard") || 
    pathname.startsWith("/admin");

  // 3. Choix du composant en fonction de la langue
  const ActiveNavbar = isGerman ? NavbarDe : isDutch ? NavbarNl : NavbarFr;
  const ActiveFooter = isGerman ? FooterDe : isDutch ? FooterNl : FooterFr;

  return (
    <html lang={isGerman ? "de" : isDutch ? "nl" : "fr"}>
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
      
      <body suppressHydrationWarning={true}>
        {!hideNavAndFooter && <ActiveNavbar />}
        <main>{children}</main>
        {!hideNavAndFooter && <ActiveFooter />}
      </body>
    </html>
  );
}