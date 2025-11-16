/**
 * Script de vérification de la base de données PostgreSQL
 * Vérifie que les tables existent et contiennent des données
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...\n')

    // Vérifier les cours
    const coursesCount = await prisma.course.count()
    console.log(`📚 Cours: ${coursesCount}`)
    if (coursesCount > 0) {
      const sampleCourse = await prisma.course.findFirst()
      console.log(`   Exemple: ${sampleCourse?.name}`)
    }

    // Vérifier les activités
    const activitiesCount = await prisma.activity.count()
    console.log(`🏄 Activités: ${activitiesCount}`)
    if (activitiesCount > 0) {
      const sampleActivity = await prisma.activity.findFirst()
      console.log(`   Exemple: ${sampleActivity?.name}`)
    }

    // Vérifier les utilisateurs
    const usersCount = await prisma.user.count()
    console.log(`👤 Utilisateurs: ${usersCount}`)

    // Vérifier la galerie
    const galleryCount = await prisma.gallery.count()
    console.log(`🖼️  Galerie: ${galleryCount}`)

    console.log('\n✅ Base de données opérationnelle!')
    
    if (coursesCount === 0 && activitiesCount === 0) {
      console.log('\n⚠️  Aucune donnée trouvée. Exécutez: npm run db:seed')
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

