import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@hopeautos.com" },
    update: {},
    create: {
      email: "admin@hopeautos.com",
      name: "Admin User",
      role: "ADMIN",
      password: adminPassword,
      emailVerified: true,
      preferences: {
        create: {
          emailNotifications: true,
          smsNotifications: false,
          priceAlerts: true,
          newArrivals: true,
          preferredMakes: [],
          preferredFuelTypes: [],
        },
      },
    },
  })

  // Create sample customer
  const customerPassword = await bcrypt.hash("customer123", 12)
  const customer = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Smith",
      role: "CUSTOMER",
      phone: "(555) 123-4567",
      password: customerPassword,
      emailVerified: true,
      preferences: {
        create: {
          maxPrice: 35000,
          preferredMakes: ["Toyota", "Honda"],
          preferredFuelTypes: ["GASOLINE", "HYBRID"],
          emailNotifications: true,
          smsNotifications: false,
          priceAlerts: true,
          newArrivals: true,
        },
      },
    },
  })

  // Create sample cars
  const cars = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 28500,
      mileage: 15000,
      color: "Silver",
      fuelType: "GASOLINE",
      transmission: "AUTOMATIC",
      bodyType: "SEDAN",
      images: ["/toyota-camry-silver.png", "/placeholder.svg?height=400&width=600"],
      description:
        "Reliable and fuel-efficient sedan perfect for daily commuting. This Toyota Camry features a spacious interior, advanced safety features, and excellent fuel economy.",
      features: ["Backup Camera", "Bluetooth", "Cruise Control", "Power Windows", "Air Conditioning", "Keyless Entry"],
      isAvailable: true,
      isFeatured: true,
    },
    {
      make: "Honda",
      model: "CR-V",
      year: 2022,
      price: 32000,
      mileage: 25000,
      color: "Blue",
      fuelType: "GASOLINE",
      transmission: "AUTOMATIC",
      bodyType: "SUV",
      images: ["/blue-honda-crv-suv.png", "/placeholder.svg?height=400&width=600"],
      description:
        "Spacious SUV with excellent safety ratings and cargo space. Perfect for families who need reliability and versatility.",
      features: [
        "All-Wheel Drive",
        "Sunroof",
        "Heated Seats",
        "Apple CarPlay",
        "Lane Keeping Assist",
        "Collision Mitigation",
      ],
      isAvailable: true,
      isFeatured: true,
    },
    {
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      price: 45000,
      mileage: 8000,
      color: "White",
      fuelType: "ELECTRIC",
      transmission: "AUTOMATIC",
      bodyType: "SEDAN",
      images: ["/tesla-model-3-white-electric.png", "/placeholder.svg?height=400&width=600"],
      description:
        "Premium electric sedan with autopilot and cutting-edge technology. Experience the future of driving with zero emissions.",
      features: [
        "Autopilot",
        "Supercharging",
        "Premium Audio",
        "Glass Roof",
        "Over-the-Air Updates",
        "15-inch Touchscreen",
      ],
      isAvailable: true,
      isFeatured: true,
    },
    {
      make: "Ford",
      model: "F-150",
      year: 2022,
      price: 38000,
      mileage: 20000,
      color: "Black",
      fuelType: "GASOLINE",
      transmission: "AUTOMATIC",
      bodyType: "TRUCK",
      images: ["/placeholder.svg?height=400&width=600"],
      description:
        "America's best-selling truck with impressive towing capacity and durability. Perfect for work and play.",
      features: ["4WD", "Towing Package", "Bed Liner", "Running Boards", "Remote Start", "Trailer Brake Controller"],
      isAvailable: true,
      isFeatured: false,
    },
    {
      make: "BMW",
      model: "3 Series",
      year: 2021,
      price: 35000,
      mileage: 18000,
      color: "Gray",
      fuelType: "GASOLINE",
      transmission: "AUTOMATIC",
      bodyType: "SEDAN",
      images: ["/placeholder.svg?height=400&width=600"],
      description:
        "Luxury sedan with sporty performance and premium features. Experience the ultimate driving machine.",
      features: ["Leather Seats", "Navigation", "Premium Sound", "Sport Mode", "Parking Sensors", "Wireless Charging"],
      isAvailable: true,
      isFeatured: false,
    },
  ]

  for (const carData of cars) {
    await prisma.car.upsert({
      where: {
        make_model_year: {
          make: carData.make,
          model: carData.model,
          year: carData.year,
        },
      },
      update: {},
      create: carData,
    })
  }

  // Create sample inquiry
  await prisma.inquiry.upsert({
    where: { id: "sample-inquiry-1" },
    update: {},
    create: {
      id: "sample-inquiry-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      message: "Interested in the Toyota Camry. Can we schedule a test drive?",
      status: "NEW",
      userId: customer.id,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log("👤 Admin user: admin@hopeautos.com / admin123")
  console.log("👤 Customer user: john@example.com / customer123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
