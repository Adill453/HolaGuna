import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Failed to fetch course categories:", error)
    return NextResponse.json({ error: "Failed to fetch course categories" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
  }
}

