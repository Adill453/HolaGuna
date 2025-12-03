import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { hours, price, description, is_active } = await request.json()
    const packageId = Number.parseInt(params.id)

    if (!hours || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await prisma.coursePackage.update({
      where: { id: packageId },
      data: {
        hours: Number.parseInt(hours),
        price: Number.parseFloat(price.toString()),
        description: description || null,
        isActive: is_active !== undefined ? is_active : true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }
    console.error("Failed to update package:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { is_active } = await request.json()
    const packageId = Number.parseInt(params.id)

    if (is_active === undefined) {
      return NextResponse.json({ error: "Missing is_active field" }, { status: 400 })
    }

    const updatedPackage = await prisma.coursePackage.update({
      where: { id: packageId },
      data: {
        isActive: is_active,
      },
    })

    return NextResponse.json({ success: true, package: updatedPackage })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }
    console.error("Failed to update package status:", error)
    return NextResponse.json({ error: "Failed to update package status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const packageId = Number.parseInt(params.id)

    await prisma.coursePackage.delete({
      where: { id: packageId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }
    console.error("Failed to delete package:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}

