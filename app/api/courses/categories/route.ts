import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.courseCategory.findMany({
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { hours: "asc" },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch course categories:", error)
    return NextResponse.json({ error: "Failed to fetch course categories" }, { status: 500 })
  }
}

