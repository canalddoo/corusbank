import { NextResponse } from "next/server";
import { db } from "@/db"; // Ajuste le chemin selon ton architecture
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

// Fonction utilitaire pour générer un IBAN autrichien au format exact commençant par AT5419120...
function generateAustrianIBAN(): string {
  const countryCode = "AT";
  
  // 1. Chiffres de contrôle fixés sur 54 comme demandé
  const checkDigits = "54";
  
  // 2. Code banque fixe officiel de la bank99 AG (5 chiffres : 19120)
  const bankCode = "19120";
  
  // 3. Génère le numéro de compte restant (11 chiffres aléatoires)
  let accountNumber = "";
  for (let i = 0; i < 11; i++) {
    accountNumber += Math.floor(Math.random() * 10).toString();
  }
   
  // Fusionne le tout pour obtenir le format exact : AT + 54 + 19120 + 11 chiffres
  return countryCode + checkDigits + bankCode + accountNumber;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { personalData, financialData, legalData } = body;

    if (!personalData?.email || !personalData?.phonePassword) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // 1. Chiffrer le mot de passe téléphonique
    const hashedPhonePassword = await bcrypt.hash(personalData.phonePassword, 10);

// 2. IBAN unique fixe pour tous les comptes
const userIban = "AT541912050151786010";
    // 3. Insérer les données fusionnées dans Turso via Drizzle
    await db.insert(users).values({
      email: personalData.email.toLowerCase().trim(),
      phonePassword: hashedPhonePassword,
      title1: personalData.title1,
      title2: personalData.title2 || null,
      firstname: personalData.firstname,
      lastname: personalData.lastname,
      birthdate: personalData.birthdate,
      birthCountry: personalData.birthCountry,
      otherNationalities: personalData.otherNationalities,
      civilStatus: personalData.civilStatus,
      address: personalData.address,
      postalCode: personalData.postalCode,
      city: personalData.city,
      mobile: personalData.mobile,
      agreePrecontractual: personalData.agreePrecontractual,

      monthlyNetIncome: Number(financialData.monthlyNetIncome) || 0,
      monthlyDeposits: financialData.monthlyDeposits,
      // Conversion du tableau d'options cochées en chaîne de caractères JSON pour le format SQLite
      incomeSources: JSON.stringify(financialData.incomeSources),
      hasCar: financialData.hasCar,
      housingStatus: financialData.housingStatus,
      taxResidence: financialData.taxResidence,

      pepStatus: legalData.pepStatus,
      acceptTerms: legalData.acceptTerms,
      fatcaDeclaration: legalData.fatcaDeclaration,
      
      // Nouvelles colonnes pour l'IBAN et le Solde à zéro
      iban: userIban,
      balance: 0.0,
      
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Inscription réussie" });
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    if (error.code === "SQLITE_CONSTRAINT" || error.message?.includes("UNIQUE")) {
      return NextResponse.json({ error: "Cette adresse e-mail est déjà associée à un compte." }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}