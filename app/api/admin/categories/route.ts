import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
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

    const categories = await prisma.courseCategory.findMany({
      include: {
        packages: {
          orderBy: { hours: "asc" },
        },
        _count: {
          select: {
            packages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

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

    const { name, description, image_url, packages } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const category = await prisma.courseCategory.create({
      data: {
        name,
        description: description || null,
        imageUrl: image_url || null,
        packages: packages && packages.length > 0 ? {
          create: packages.map((pkg: { hours: number | string; price: number | string; description?: string; is_active?: boolean }) => ({
            hours: Number.parseInt(pkg.hours.toString()),
            price: Number.parseFloat(pkg.price.toString()),
            description: pkg.description || null,
            isActive: pkg.is_active !== undefined ? pkg.is_active : true,
          })),
        } : undefined,
      },
      include: {
        packages: true,
      },
    })

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

