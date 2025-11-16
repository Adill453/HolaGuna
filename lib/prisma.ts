import { PrismaClient } from "@prisma/client"

/**
 * Prisma Client singleton pattern optimisé pour Vercel serverless
 * 
 * En environnement serverless (Vercel), chaque invocation peut créer une nouvelle instance.
 * Ce pattern garantit qu'une seule instance est créée et réutilisée, évitant les erreurs
 * de connexion multiples et les problèmes de performance.
 * 
 * En développement, l'instance est stockée dans globalThis pour éviter les re-créations
 * lors du hot-reload de Next.js.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  })

// En développement, on stocke l'instance dans globalThis pour éviter les re-créations
// En production (Vercel), chaque fonction serverless a son propre contexte,
// donc cette ligne n'a pas d'effet, mais le pattern singleton fonctionne quand même
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
