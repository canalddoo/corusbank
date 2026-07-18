import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { transfers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { beneficiaryName, iban, bic, amount } = await request.json();

    if (!beneficiaryName || !iban || !bic || !amount) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Vérifier le solde actuel de l'utilisateur
    const user = await db.select().from(users).where(eq(users.email, userEmail)).get();
    if (!user || Number(user.balance || 0) < Number(amount)) {
      return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 });
    }

    // Insérer la demande de virement en statut "En attente"
    await db.insert(transfers).values({
      userEmail,
      beneficiaryName,
      iban,
      bic,
      amount: Number(amount),
      status: "En attente",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur transfert:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}