import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer les données de l'utilisateur depuis la base de données
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .get(); // ou .all()[0] selon la configuration de ton driver

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        firstname: dbUser.firstname || "",
        lastname: dbUser.lastname || "",
        email: dbUser.email,
        // iban: dbUser.iban || "Non configuré", 
        iban: dbUser.iban || "Non configuré", // <-- Récupère le vrai IBAN de la BDD ici
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur lors de la récupération du profil" }, { status: 500 });
  }
}