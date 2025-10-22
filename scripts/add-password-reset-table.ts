import { prisma } from "@/lib/prisma"

async function main() {
  try {
    console.log("Adding PasswordResetToken table...")

    // Check if AdminSetting already exists
    const checkTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'PasswordResetToken'
      );
    `

    if (!checkTable) {
      console.log("Creating PasswordResetToken table...")
      await prisma.$executeRaw`
        CREATE TABLE "PasswordResetToken" (
          "id" SERIAL NOT NULL,
          "userId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "PasswordResetToken_userId_key" UNIQUE("userId"),
          CONSTRAINT "PasswordResetToken_token_key" UNIQUE("token"),
          CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `
      console.log("✅ PasswordResetToken table created successfully")
    } else {
      console.log("PasswordResetToken table already exists")
    }

    console.log("✅ Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
