import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, cards } from "@/db/schema";
import { eq, sql } from "drizzle-orm"; // <-- Ajout de sql ici

// Génère un IBAN stable basé sur le numéro de carte
function getDeterministicIBAN(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, "");
  const seed = cleanNumber.slice(-8) || "98765432";
  const countryCode = "AT";
  const checkDigits = "42"; 
  const bankCode = "19020"; 
  const accountNumber = `0000${seed}`; 
  
  const rawIban = countryCode + checkDigits + bankCode + accountNumber;
  return rawIban.match(/.{1,4}/g)?.join(" ") || rawIban;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.email, userEmail)).get();
    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Sélection explicite des colonnes réelles uniquement
    const dbCard = await db
      .select({
        id: cards.id,
        userEmail: cards.userEmail,
        cardNumber: cards.cardNumber,
        expiryDate: cards.expiryDate,
        cvc: cards.cvc,
        createdAt: cards.createdAt,
      })
      .from(cards)
      .where(eq(cards.userEmail, userEmail))
      .get();

    if (!dbCard) {
      return NextResponse.json({
        success: true,
        hasCard: false,
        cardInfo: null
      });
    }

    return NextResponse.json({
      success: true,
      hasCard: true,
      cardInfo: {
        id: dbCard.id,
        fullname: `${dbUser.firstname || ""} ${dbUser.lastname || ""}`.trim() || "KÖRPER IRENE",
        cardNumber: dbCard.cardNumber,
        expiryDate: dbCard.expiryDate,
        cvc: dbCard.cvc,
        iban: getDeterministicIBAN(dbCard.cardNumber)
      }
    });
  } catch (error) {
    console.error("Erreur critique GET card:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const existingCard = await db
      .select({ id: cards.id })
      .from(cards)
      .where(eq(cards.userEmail, userEmail))
      .get();

    if (existingCard) {
      return NextResponse.json({ error: "Une carte existe déjà pour ce compte" }, { status: 400 });
    }

    let segments = ["5375", "2852"];
    for (let i = 0; i < 2; i++) {
      segments.push(Math.floor(1000 + Math.random() * 9000).toString());
    }
    const cardNumber = segments.join(" ");
    const expiryDate = "12/30";
    const cvc = Math.floor(100 + Math.random() * 900).toString();
    const createdAt = new Date().toISOString();

    // SOLUTION RADICALE : Utilisation d'une requête d'insertion SQL brute préparée via Drizzle.
    // Cela force SQLite à ignorer totalement le schéma de ton code et à n'exécuter que les colonnes existantes.
    await db.run(
      sql`INSERT INTO cards (user_email, card_number, expiry_date, cvc, created_at) VALUES (${userEmail}, ${cardNumber}, ${expiryDate}, ${cvc}, ${createdAt})`
    );

    return NextResponse.json({ success: true, message: "Carte générée avec succès !" });
  } catch (error) {
    console.error("Erreur critique POST card:", error);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}