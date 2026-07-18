import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { loans } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// 1. RÉCUPÉRER L'HISTORIQUE DES DEMANDES DE L'UTILISATEUR CONNECTÉ
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const history = await db
      .select()
      .from(loans)
      .where(eq(loans.userEmail, userEmail))
      .orderBy(desc(loans.createdAt))
      .all();

    return NextResponse.json({ success: true, history });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 2. ENREGISTRER UNE NOUVELLE DEMANDE (Inclut la raison et l'email de contact)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    
    // Récupération de tous les champs envoyés par le front-end, y compris contactEmail
    const { 
      type, 
      purchasePrice, 
      loanAmount, 
      duration, 
      interestType, 
      monthlyPayment, 
      reason,
      contactEmail // <-- Récupéré depuis le JSON envoyé par le front-end
    } = body;

    // Validation rapide pour s'assurer que le champ n'est pas vide
    if (!contactEmail) {
      return NextResponse.json({ error: "L'adresse e-mail de contact est requise" }, { status: 400 });
    }

    await db.insert(loans).values({
      userEmail, // E-mail du compte d'inscription (issu de la session cookie)
      contactEmail, // <-- Nouvel e-mail de suivi fourni dans la modale
      type,
      purchasePrice: purchasePrice ? Number(purchasePrice) : null,
      loanAmount: Number(loanAmount),
      duration: Number(duration),
      interestType,
      monthlyPayment: Number(monthlyPayment),
      reason: reason || "Non précisé",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Demande enregistrée avec succès !" });
  } catch (error) {
    console.error("Erreur insertion prêt:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'enregistrement" }, { status: 500 });
  }
}