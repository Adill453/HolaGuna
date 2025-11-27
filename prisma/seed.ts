import { PrismaClient, CourseType, PricingTier } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@kitedakhla.com" },
    update: {},
    create: {
      email: "admin@kitedakhla.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
      name: "Admin User",
      phone: "+212-123-456-789",
    },
  })

  // Clear existing data
  await prisma.coursePackage.deleteMany({})
  await prisma.courseCategory.deleteMany({})
  await prisma.course.deleteMany({})

  // Create Course Categories with Packages
  // Group Category
  const groupCategory = await prisma.courseCategory.create({
    data: {
      name: "Group",
      description: "Learn kitesurfing in a group setting with up to 8 participants. Perfect for learning with others and making new friends.",
      imageUrl: "/kitesurfing-2.webp",
      packages: {
        create: [
          { hours: 2, price: 70.0, isActive: true },
          { hours: 4, price: 140.0, isActive: true },
          { hours: 6, price: 210.0, isActive: true },
          { hours: 8, price: 280.0, isActive: true },
          { hours: 10, price: 350.0, isActive: true },
          { hours: 12, price: 420.0, isActive: true },
          { hours: 20, price: 700.0, isActive: true },
        ],
      },
    },
  })

  // Semi-Private Category
  const semiPrivateCategory = await prisma.courseCategory.create({
    data: {
      name: "Semi-Private",
      description: "Semi-private lessons with smaller groups (up to 3 participants). Get more personalized attention while still enjoying the group dynamic.",
      imageUrl: "/kitesurfing-3.webp",
      packages: {
        create: [
          { hours: 2, price: 110.0, isActive: true },
          { hours: 4, price: 210.0, isActive: true },
          { hours: 6, price: 305.0, isActive: true },
          { hours: 8, price: 385.0, isActive: true },
          { hours: 10, price: 450.0, isActive: true },
          { hours: 12, price: 520.0, isActive: true },
        ],
      },
    },
  })

  // Private Category
  const privateCategory = await prisma.courseCategory.create({
    data: {
      name: "Private",
      description: "One-on-one private lessons with dedicated instructor attention. Perfect for accelerated learning and personalized instruction.",
      imageUrl: "/kitesurfing-3.webp",
      packages: {
        create: [
          { hours: 2, price: 160.0, isActive: true },
          { hours: 4, price: 300.0, isActive: true },
          { hours: 6, price: 445.0, isActive: true },
          { hours: 8, price: 575.0, isActive: true },
          { hours: 10, price: 680.0, isActive: true },
          { hours: 12, price: 780.0, isActive: true },
        ],
      },
    },
  })

  // Keep old Course model entries for backward compatibility (Buggy, Mountain Board, etc.)
  await prisma.course.createMany({
    data: [
      // BUGGY courses
      {
        name: "Kite Buggy - Complete Beginner",
        description: "Power kite lessons + kite buggy intro lesson. For complete beginners.",
        price: 150.0,
        durationHours: 3,
        maxParticipants: 4,
        courseType: CourseType.BUGGY,
        pricingTier: null,
        minAge: 12,
        imageUrl: "/buggy-2.webp",
      },
      {
        name: "Kite Buggy - Beginner",
        description: "For power flyer with some good basic skills or for persons who control good a 4 lines kites + buggy intro lesson.",
        price: 80.0,
        durationHours: 1.5,
        maxParticipants: 4,
        courseType: CourseType.BUGGY,
        pricingTier: null,
        minAge: 12,
        imageUrl: "/buggy-2.webp",
      },
      // MOUNTAIN BOARD courses
      {
        name: "Kiteland - Mountain Board",
        description: "For power flyer with some good basic skills or for persons who control good a 4 lines kites + mountain board intro lesson.",
        price: 80.0,
        durationHours: 1.5,
        maxParticipants: 4,
        courseType: CourseType.MOUNTAIN_BOARD,
        pricingTier: null,
        imageUrl: "/mountain board-3.webp",
      },
    ],
  })

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        name: "Stand Up Paddleboarding",
        description: "Explore the calm waters of Dakhla lagoon with our premium paddleboards.",
        price: 50.0,
        durationHours: 2,
        equipmentIncluded: true,
        imageUrl: "/standup paddle-1.webp",
      },
      {
        name: "Sunset Kitesurfing",
        description: "Experience magical sunset sessions on the water with breathtaking views.",
        price: 150.0,
        durationHours: 2,
        equipmentIncluded: true,
        imageUrl: "/kitesurfing-4.webp",
      },
      {
        name: "Buggy Adventure",
        description: "Thrilling buggy rides along the beach for an adrenaline-packed experience.",
        price: 80.0,
        durationHours: 1,
        equipmentIncluded: true,
        imageUrl: "/buggy-4.webp",
      },
      {
        name: "Mountain Boarding",
        description: "Learn the art of landboarding with our expert instructors and top-notch equipment.",
        price: 60.0,
        durationHours: 2,
        equipmentIncluded: true,
        imageUrl: "/mountain board-3.webp",
      },
    ],
    //skipDuplicates: true,
  })

  // Create sample gallery images
  await prisma.gallery.createMany({
    data: [
      {
        title: "Epic Kitesurfing Session",
        description: "Amazing kitesurfing action in Dakhla lagoon",
        imageUrl: "/kitesurfing-1.webp",
        category: "KITESURFING",
        isFeatured: true,
      },
      {
        title: "Epic Kitesurfing Session",
        description: "Amazing kitesurfing action in Dakhla lagoon",
        imageUrl: "/kitesurfing-2.webp",
        category: "KITESURFING",
        isFeatured: false,
      },
      {
        title: "Epic Kitesurfing Session",
        description: "Amazing kitesurfing action in Dakhla lagoon",
        imageUrl: "/kitesurfing-3.webp",
        category: "KITESURFING",
        isFeatured: false,
      },
      {
        title: "Epic Kitesurfing Session",
        description: "Amazing kitesurfing action in Dakhla lagoon",
        imageUrl: "/kitesurfing-4.webp",
        category: "KITESURFING",
        isFeatured: true,
      },
      {
        title: "Buggy Fun",
        description: "Thrilling buggy adventure on the beach",
        imageUrl: "/buggy-1.webp",
        category: "BUGGY",
        isFeatured: true,
      },
      {
        title: "Buggy Fun",
        description: "Thrilling buggy adventure on the beach",
        imageUrl: "/buggy-2.webp",
        category: "BUGGY",
        isFeatured: false,
      },
      {
        title: "Buggy Fun",
        description: "Thrilling buggy adventure on the beach",
        imageUrl: "/buggy-3.webp",
        category: "BUGGY",
        isFeatured: false,
      },
      {
        title: "Buggy Fun",
        description: "Thrilling buggy adventure on the beach",
        imageUrl: "/buggy-4.webp",
        category: "BUGGY",
        isFeatured: true,
      },

      {
        title: "Mountain boarding",
        description: "Professional landboarding techniques",
        imageUrl: "/mountain board-1.webp",
        category: "MOUNTAIN_BOARD",
        isFeatured: true,
      },
      {
        title: "Mountain boarding",
        description: "Professional landboarding techniques",
        imageUrl: "/mountain board-2.webp",
        category: "MOUNTAIN_BOARD",
        isFeatured: false,
      },
      {
        title: "Mountain boarding",
        description: "Professional landboarding techniques",
        imageUrl: "/mountain board-3.webp",
        category: "MOUNTAIN_BOARD",
        isFeatured: true,
      },
      {
        title: "Mountain boarding",
        description: "Professional landboarding techniques",
        imageUrl: "/mountain board-4.webp",
        category: "MOUNTAIN_BOARD",
        isFeatured: false,
      },
      
      {
        title: "Peaceful stand up paddleboarding",
        description: "Serene paddleboard session at sunset",
        imageUrl: "/standup paddle-1.webp",
        category: "STANDUP_PADDLE",
        isFeatured: true,
      },
      {
        title: "Peaceful stand up paddleboarding",
        description: "Serene paddleboard session at sunset",
        imageUrl: "/standup paddle-2.webp",
        category: "STANDUP_PADDLE",
        isFeatured: false,
      },
      {
        title: "Peaceful stand up paddleboarding",
        description: "Serene paddleboard session at sunset",
        imageUrl: "/standup paddle-3.webp",
        category: "STANDUP_PADDLE",
        isFeatured: false,
      },
      {
        title: "Peaceful stand up paddleboarding",
        description: "Serene paddleboard session at sunset",
        imageUrl: "/standup paddle-4.webp",
        category: "STANDUP_PADDLE",
        isFeatured: false,
      },
    ],
    //skipDuplicates: true,
  })

  console.log("Database seeded successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
