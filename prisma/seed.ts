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

  // Clear existing courses
  await prisma.course.deleteMany({})

  // Create KITESURFING courses
  // GROUP pricing
  await prisma.course.createMany({
    data: [
      {
        name: "Kitesurfing - Group - 2H",
        description: "Group kitesurfing lesson for 2 hours. Perfect for learning with others.",
        price: 70.0,
        durationHours: 2,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 4H",
        description: "Group kitesurfing lesson for 4 hours.",
        price: 140.0,
        durationHours: 4,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 6H",
        description: "Group kitesurfing lesson for 6 hours.",
        price: 210.0,
        durationHours: 6,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 8H",
        description: "Group kitesurfing lesson for 8 hours.",
        price: 280.0,
        durationHours: 8,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 10H",
        description: "Group kitesurfing lesson for 10 hours.",
        price: 350.0,
        durationHours: 10,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 12H",
        description: "Group kitesurfing lesson for 12 hours.",
        price: 420.0,
        durationHours: 12,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      {
        name: "Kitesurfing - Group - 20H",
        description: "Group kitesurfing lesson for 20 hours.",
        price: 700.0,
        durationHours: 20,
        maxParticipants: 8,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.GROUP,
        imageUrl: "/kitesurfing-2.webp",
      },
      // SEMI-PRIVATE pricing
      {
        name: "Kitesurfing - Semi-Private - 2H",
        description: "Semi-private kitesurfing lesson for 2 hours per person.",
        price: 103.0,
        durationHours: 2,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - 4H",
        description: "Semi-private kitesurfing lesson for 4 hours per person.",
        price: 206.0,
        durationHours: 4,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - 6H",
        description: "Semi-private kitesurfing lesson for 6 hours per person.",
        price: 285.0,
        durationHours: 6,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - 8H",
        description: "Semi-private kitesurfing lesson for 8 hours per person.",
        price: 355.0,
        durationHours: 8,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - 10H",
        description: "Semi-private kitesurfing lesson for 10 hours per person.",
        price: 417.0,
        durationHours: 10,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - 12H",
        description: "Semi-private kitesurfing lesson for 12 hours per person.",
        price: 500.0,
        durationHours: 12,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Semi-Private - Extra 2H",
        description: "Extra 2 hours for semi-private kitesurfing lesson.",
        price: 75.0,
        durationHours: 2,
        maxParticipants: 3,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.SEMI_PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      // PRIVATE pricing
      {
        name: "Kitesurfing - Private - 2H",
        description: "Private kitesurfing lesson for 2 hours.",
        price: 150.0,
        durationHours: 2,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - 4H",
        description: "Private kitesurfing lesson for 4 hours.",
        price: 285.0,
        durationHours: 4,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - 6H",
        description: "Private kitesurfing lesson for 6 hours.",
        price: 410.0,
        durationHours: 6,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - 8H",
        description: "Private kitesurfing lesson for 8 hours.",
        price: 520.0,
        durationHours: 8,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - 10H",
        description: "Private kitesurfing lesson for 10 hours.",
        price: 626.0,
        durationHours: 10,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - 12H",
        description: "Private kitesurfing lesson for 12 hours.",
        price: 745.0,
        durationHours: 12,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
      {
        name: "Kitesurfing - Private - Extra 2H",
        description: "Extra 2 hours for private kitesurfing lesson.",
        price: 125.0,
        durationHours: 2,
        maxParticipants: 1,
        courseType: CourseType.KITESURFING,
        pricingTier: PricingTier.PRIVATE,
        imageUrl: "/kitesurfing-3.webp",
      },
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
