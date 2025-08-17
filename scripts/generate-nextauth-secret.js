#!/usr/bin/env node

/**
 * Generate a secure NextAuth secret
 */

const crypto = require("crypto")

function generateSecret() {
  // Generate a 32-byte random string and convert to base64
  const secret = crypto.randomBytes(32).toString("base64")
  return secret
}

console.log("🔐 NextAuth Secret Generator")
console.log("=".repeat(40))
console.log("")
console.log("Generated NextAuth Secret:")
console.log(generateSecret())
console.log("")
console.log("Add this to your .env.local file:")
console.log(`NEXTAUTH_SECRET=${generateSecret()}`)
console.log("")
console.log("⚠️  Keep this secret secure and never commit it to version control!")
