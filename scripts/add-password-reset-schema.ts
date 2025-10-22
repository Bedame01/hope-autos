const schemaUpdate = `
model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// Add to User model:
// passwordResetTokens PasswordResetToken[]
`

console.log("=== Password Reset Schema Update ===")
console.log("Add the following to your prisma/schema.prisma file:\n")
console.log(schemaUpdate)
console.log("\n=== Run Migration ===")
console.log("Execute this command:")
console.log("npx prisma migrate dev --name add_password_reset_token")
console.log("\n=== Or use Prisma Studio ===")
console.log("npx prisma studio")
