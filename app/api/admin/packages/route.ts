import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Désactiver temporairement la vérification d'authentification pour le développement
    // const token = request.cookies.get("auth-token")?.value
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // const user = verifyToken(token)
    // if (!user || user.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const { category_id, hours, price, description, is_active } = await request.json()

    if (!category_id || !hours || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const packageData = await prisma.coursePackage.create({
      data: {
        categoryId: Number.parseInt(category_id),
        hours: Number.parseInt(hours),
        price: Number.parseFloat(price.toString()),
        description: description || null,
        isActive: is_active !== undefined ? is_active : true,
      },
    })

    return NextResponse.json({
      success: true,
      package: packageData,
    })
  } catch (error) {
    console.error("Failed to create package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}

