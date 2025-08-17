#!/usr/bin/env node

/**
 * Fix OAuth account linking issues
 * This script finds users with the same email across different auth providers
 * and links their accounts properly
 */

import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

// Load environment variables
config({ path: ".env.local" })

const prisma = new PrismaClient()

async function fixOAuthAccounts() {
  console.log("🔧 Fixing OAuth Account Linking Issues")
  console.log("=".repeat(40))

  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
      },
    })

    // Group users by email
    const usersByEmail: Record<string, typeof users> = {}

    users.forEach((user) => {
      if (!usersByEmail[user.email]) {
        usersByEmail[user.email] = []
      }
      usersByEmail[user.email].push(user)
    })

    // Find emails with multiple users
    const duplicateEmails = Object.entries(usersByEmail)
      .filter(([_, users]) => users.length > 1)
      .map(([email, _]) => email)

    if (duplicateEmails.length === 0) {
      console.log("✅ No duplicate email accounts found!")
      return
    }

    console.log(`🔍 Found ${duplicateEmails.length} email(s) with multiple accounts:`)

    // Process each duplicate email
    for (const email of duplicateEmails) {
      const usersWithEmail = usersByEmail[email]
      console.log(`\n📧 Processing ${email}:`)

      // Find the primary user (prefer password-based or oldest account)
      const primaryUser = usersWithEmail.find((u) => u.password) || usersWithEmail[0]
      const secondaryUsers = usersWithEmail.filter((u) => u.id !== primaryUser.id)

      console.log(`   Primary user: ${primaryUser.name} (ID: ${primaryUser.id})`)
      console.log(`   Secondary users: ${secondaryUsers.length}`)

      // For each secondary user, move their accounts to the primary user
      for (const secondaryUser of secondaryUsers) {
        console.log(`   - Processing user: ${secondaryUser.name} (ID: ${secondaryUser.id})`)

        // Move accounts to primary user
        for (const account of secondaryUser.accounts) {
          // Check if primary user already has this provider
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: primaryUser.id,
              provider: account.provider,
            },
          })

          if (existingAccount) {
            console.log(`     ⚠️ Primary user already has a ${account.provider} account, skipping`)
            continue
          }

          // Move account to primary user
          await prisma.account.update({
            where: { id: account.id },
            data: { userId: primaryUser.id },
          })

          console.log(`     ✅ Moved ${account.provider} account to primary user`)
        }

        // Check if we should delete the secondary user
        const remainingAccounts = await prisma.account.count({
          where: { userId: secondaryUser.id },
        })

        if (remainingAccounts === 0) {
          // Delete user preferences first (due to foreign key constraints)
          await prisma.userPreferences.deleteMany({
            where: { userId: secondaryUser.id },
          })

          // Delete the secondary user
          await prisma.user.delete({
            where: { id: secondaryUser.id },
          })

          console.log(`     🗑️ Deleted secondary user (all accounts moved)`)
        } else {
          console.log(`     ⚠️ Secondary user still has ${remainingAccounts} accounts, not deleting`)
        }
      }
    }

    console.log("\n✅ Account linking issues fixed successfully!")
  } catch (error) {
    console.error("❌ Error fixing OAuth accounts:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixOAuthAccounts()
