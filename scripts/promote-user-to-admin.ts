import { PrismaClient } from "@prisma/client"
import readline from "readline"

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function promoteUserToAdmin() {
  try {
    console.log("🔄 Promote User to Admin\n")

    // Get all non-admin users
    const users = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    if (users.length === 0) {
      console.log("❌ No customer users found to promote")
      process.exit(0)
    }

    console.log("📋 Available users to promote:\n")
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
      console.log(`   ID: ${user.id}\n`)
    })

    const selection = await question("Enter the number of the user to promote to admin: ")
    const userIndex = Number.parseInt(selection) - 1

    if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
      console.error("❌ Invalid selection")
      process.exit(1)
    }

    const selectedUser = users[userIndex]

    // Confirm promotion
    const confirm = await question(
      `Are you sure you want to promote ${selectedUser.name} (${selectedUser.email}) to admin? (y/N): `,
    )

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      console.log("❌ Promotion cancelled")
      process.exit(0)
    }

    // Promote user
    const updatedUser = await prisma.user.update({
      where: { id: selectedUser.id },
      data: { role: "ADMIN" },
    })

    console.log("\n✅ User promoted to admin successfully!")
    console.log(`📧 Email: ${updatedUser.email}`)
    console.log(`👤 Name: ${updatedUser.name}`)
    console.log(`🔑 New Role: ${updatedUser.role}`)
    console.log("\n🎉 They can now access the admin panel at /admin")
  } catch (error) {
    console.error("❌ Error promoting user:", error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

promoteUserToAdmin()
