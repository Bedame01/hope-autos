import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import readline from "readline"

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function createCustomAdmin() {
  try {
    console.log("🚀 Creating Custom Admin Account\n")

    const email = await question("Enter admin email: ")
    const name = await question("Enter admin name: ")
    const password = await question("Enter admin password: ")

    // Validate input
    if (!email || !name || !password) {
      console.error("❌ All fields are required")
      process.exit(1)
    }

    if (password.length < 6) {
      console.error("❌ Password must be at least 6 characters")
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.error(`❌ User with email ${email} already exists`)
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("\n✅ Admin account created successfully!")
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Name: ${admin.name}`)
    console.log(`🔑 Role: ${admin.role}`)
    console.log(`🆔 ID: ${admin.id}`)
    console.log("\n🎉 You can now access the admin panel at /admin")
  } catch (error) {
    console.error("❌ Error creating admin:", error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createCustomAdmin()
