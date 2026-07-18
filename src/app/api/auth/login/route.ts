import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // <-- 1. Importation essentielle !
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, phonePassword } = await request.json();

    if (!email || !phonePassword) {
      return NextResponse.json({ error: "Identifiants requis" }, { status: 400 });
    }

    // 1. Rechercher l'utilisateur par son email unique
    const foundUsers = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    
    if (foundUsers.length === 0) {
      return NextResponse.json({ error: "Identifiants ou mot de passe incorrects." }, { status: 401 });
    }

    const user = foundUsers[0];

    // 2. Comparer le mot de passe saisi avec la valeur chiffrée en base
    const isPasswordValid = await bcrypt.compare(phonePassword, user.phonePassword);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Identifiants ou mot de passe incorrects." }, { status: 401 });
    }

    // 3. CRÉATION DU COOKIE DE SESSION SECURISE
    const cookieStore = await cookies();
    cookieStore.set("user_session", user.email, {
      httpOnly: true,     // Protège le cookie contre les attaques XSS (invisible en JS côté client)
      secure: process.env.NODE_ENV === "production", // HTTPS uniquement en production
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // Le cookie expire automatiquement après 24 heures
      path: "/",          // Accessible partout sur le site
    });

    // Renvoi des données sans l'empreinte du mot de passe
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });

  } catch (error) {
    console.error("Erreur lors du login:", error);
    return NextResponse.json({ error: "Erreur serveur de traitement." }, { status: 500 });
  }
}