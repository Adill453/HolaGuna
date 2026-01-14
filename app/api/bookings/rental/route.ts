import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      phone, 
      startDate, 
      days, 
      includeInsurance, 
      totalPrice, 
      notes,
      rentalInfo 
    } = body

    // Validation basique
    if (!name || !phone || !startDate || !days || totalPrice === undefined) {
      return NextResponse.json(
        { error: "Informations manquantes" },
        { status: 400 }
      )
    }

    // Créer ou récupérer l'utilisateur
    let user = await prisma.user.findFirst({
      where: { phone }
    })

    if (!user) {
      // Créer un utilisateur temporaire
      const safePhone = phone.replace(/[^0-9]/g, '')
      user = await prisma.user.create({
        data: {
          email: `rental_${safePhone}@guest.com`,
          name,
          phone,
          passwordHash: "",
          role: "CLIENT"
        }
      })
    }

    // Créer la réservation de location
    // Pour les locations, on utilise le champ notes pour stocker les détails
    // et on peut utiliser un activityId null ou créer une activité spéciale pour les locations
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        courseId: null,
        packageId: null,
        activityId: null,
        bookingDate: new Date(startDate),
        bookingTime: "00:00", // Les locations n'ont pas d'heure spécifique
        participants: 1, // Une location = 1 personne
        totalPrice,
        status: "PENDING",
        notes: notes || `Location kitesurfing - ${days} jour(s), ${includeInsurance ? "avec" : "sans"} assurance. ${rentalInfo ? `Détails: ${rentalInfo}` : ""}`,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Erreur lors de la création de la réservation de location:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}



