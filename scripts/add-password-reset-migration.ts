import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Creating PasswordResetToken table...")

  try {
    // This would be handled by prisma migrate
    // Adding a schema update note here
    console.log("Please run: npx prisma migrate dev --name add_password_reset_token")
    console.log(
      "And add this to your schema.prisma:\n\nmodel PasswordResetToken {\n  id        String   @id @default(cuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  token     String   @unique\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n}\n",
    )
  } catch (error) {
    console.error("Migration error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
