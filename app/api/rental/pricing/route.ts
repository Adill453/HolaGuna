import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pricing = await prisma.rentalPricing.findMany({
      orderBy: [
        { isExtraDay: "asc" },
        { days: "asc" },
      ],
    })

    return NextResponse.json({ pricing })
  } catch (error) {
    console.error("Erreur lors de la récupération des tarifs de location:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}



