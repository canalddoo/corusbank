import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db"; // Adapte le chemin selon ton projet
import { users } from "@/db/schema";
import { transfers, deposits } from "@/db/schema"; // <-- Ajoute l'import de deposits
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_session")?.value;

    if (!userEmail) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Récupérer les infos de l'utilisateur depuis Turso
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .get();

   if (!foundUser) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userTransfers = await db
  .select()
  .from(transfers)
  .where(eq(transfers.userEmail, userEmail))
  .orderBy(desc(transfers.createdAt))
  .all();

const userDeposits = await db
  .select()
  .from(deposits)
  .where(eq(deposits.userEmail, userEmail))
  .orderBy(desc(deposits.createdAt))
  .all();

return NextResponse.json({
  authenticated: true,
  user: {
    firstname: foundUser.firstname,
    lastname: foundUser.lastname,
    email: foundUser.email,
    birthCountry: foundUser.birthCountry,
    iban: foundUser.iban,
    balance: foundUser.balance,
  },
  transfers: userTransfers,
  deposits: userDeposits, // <-- Transmet l'historique des entrées
});

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}