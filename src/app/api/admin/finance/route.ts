import { NextResponse } from "next/server";
import { db } from "@/db";
import { loans, users, transfers, deposits } from "@/db/schema"; // <-- N'oublie pas d'ajouter deposits à l'import
import { desc, eq } from "drizzle-orm";

// Fonction de validation de l'authentification Basic Admin
function validateAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  return !!(authHeader && authHeader === "Basic QWRtaW46QWRtaW4wMjA=");
}

// Récupération de toutes les données du panneau d'administration (Prêts, Utilisateurs, Virements)
export async function GET(request: Request) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
    }

    // 1. Récupérer toutes les demandes de prêts
    const allLoans = await db
      .select()
      .from(loans)
      .orderBy(desc(loans.createdAt))
      .all();

    // 2. Récupérer la liste de tous les utilisateurs avec leurs soldes
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstname: users.firstname,
        lastname: users.lastname,
        balance: users.balance,
      })
      .from(users)
      .all();

    // 3. Récupérer toutes les demandes de virements interbancaires
    const allTransfers = await db
      .select()
      .from(transfers)
      .orderBy(desc(transfers.createdAt))
      .all();

    return NextResponse.json({ 
      success: true, 
      loans: allLoans, 
      users: allUsers, 
      transfers: allTransfers 
    });
  } catch (error) {
    console.error("Erreur GET Admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Traitement des actions de l'administrateur
export async function POST(request: Request) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
    }

    const body = await request.json();
    const { intent } = body;

    // INTENT 1 : APPROBATION / REFUS D'UN VIREMENT BANCAIRE (ET DÉDUCTION DU SOLDE)
    if (intent === "update_transfer_status") {
      const { transferId, status } = body;
      
      if (!transferId || !status) {
        return NextResponse.json({ error: "Données de virement incomplètes" }, { status: 400 });
      }
      
      const transfer = await db.select().from(transfers).where(eq(transfers.id, Number(transferId))).get();
      if (!transfer) {
        return NextResponse.json({ error: "Virement introuvable" }, { status: 404 });
      }
      if (transfer.status !== "En attente") {
        return NextResponse.json({ error: "Ce virement a déjà été traité" }, { status: 400 });
      }

      // Si l'admin approuve le virement, on valide et déduit le solde du client
      if (status === "Approuvé") {
        const client = await db.select().from(users).where(eq(users.email, transfer.userEmail)).get();
        
        if (!client) {
          return NextResponse.json({ error: "Le client associé à ce virement n'existe plus" }, { status: 404 });
        }
        
        if (Number(client.balance || 0) < Number(transfer.amount)) {
          return NextResponse.json({ error: "Solde insuffisant chez le client pour valider ce virement" }, { status: 400 });
        }
        
        // Déduction du montant du virement du solde de l'utilisateur
        await db.update(users)
          .set({ balance: Number(client.balance) - Number(transfer.amount) })
          .where(eq(users.email, transfer.userEmail));
      }

      // Mise à jour du statut final de la transaction dans la table transfers
      await db.update(transfers)
        .set({ status })
        .where(eq(transfers.id, Number(transferId)));

      return NextResponse.json({ success: true, message: `Virement marqué comme ${status} avec succès !` });
    }

    // INTENT 2 : CHANGEMENT DU STATUT D'UNE DEMANDE DE PRÊT
    if (intent === "update_loan_status") {
      const { loanId, status } = body;
      if (!loanId || !status) {
        return NextResponse.json({ error: "Données de prêt incomplètes" }, { status: 400 });
      }

      await db
        .update(loans)
        .set({ status: status })
        .where(eq(loans.id, Number(loanId)));

      return NextResponse.json({ success: true, message: "Statut du prêt synchronisé !" });
    }

    // INTENT 3 : AJUSTEMENT MANUEL DU SOLDE UTILISATEUR (ADD OU SET)
   // INTENT 3 : AJUSTEMENT MANUEL DU SOLDE UTILISATEUR (ADD OU SET)
    if (intent === "update_balance") {
      const { email, amount, action } = body;
      if (!email || amount === undefined) {
        return NextResponse.json({ error: "Données de portefeuille incomplètes" }, { status: 400 });
      }

      const targetUser = await db.select().from(users).where(eq(users.email, email)).get();
      if (!targetUser) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
      }

      const numericAmount = Number(amount);
      const currentBalance = Number(targetUser.balance || 0);
      
      // Calcul du nouveau solde
      const newBalance = action === "add" ? currentBalance + numericAmount : numericAmount;
      
      // Calcul du montant réel entré (pour l'historique si c'est un "set")
      const realDepositedAmount = action === "add" ? numericAmount : (numericAmount - currentBalance);

      // 1. Mettre à jour le solde de l'utilisateur
      await db
        .update(users)
        .set({ balance: newBalance })
        .where(eq(users.email, email));

      // 2. AJOUT HISTORIQUE : Uniquement si de l'argent a effectivement été ajouté
      if (realDepositedAmount > 0) {
        await db.insert(deposits).values({
          userEmail: email,
          amount: realDepositedAmount,
          type: action,
          createdAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true, message: "Solde mis à jour et historique enregistré !", newBalance });
    }

    return NextResponse.json({ error: "Intention non reconnue" }, { status: 400 });
  } catch (error) {
    console.error("Erreur POST Admin:", error);
    return NextResponse.json({ error: "Erreur lors du traitement de la requête administrative" }, { status: 500 });
  }
}