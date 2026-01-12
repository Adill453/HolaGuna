import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      { activities },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
  } catch (error) {
    console.error("Failed to fetch activities:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  }
}
