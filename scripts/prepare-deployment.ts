import { execSync } from "child_process"
import fs from "fs"

console.log("🚀 Preparing Hope Autos for deployment...\n")

// Check if required files exist
const requiredFiles = [".env.local", "prisma/schema.prisma", "package.json"]

console.log("📋 Checking required files...")
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`)
  } else {
    console.log(`❌ ${file} missing`)
  }
}

// Check environment variables
console.log("\n🔧 Checking environment variables...")
const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

const envFile = ".env.local"
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf8")

  for (const envVar of requiredEnvVars) {
    if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your-`)) {
      console.log(`✅ ${envVar} configured`)
    } else {
      console.log(`❌ ${envVar} needs configuration`)
    }
  }
} else {
  console.log("❌ .env.local file not found")
}

// Check database connection
console.log("\n🗄️ Testing database connection...")
try {
  execSync("npx prisma db push --accept-data-loss", { stdio: "pipe" })
  console.log("✅ Database connection successful")
} catch (error) {
  console.log("❌ Database connection failed")
  console.log("Please check your DATABASE_URL")
}

// Generate Prisma client
console.log("\n⚙️ Generating Prisma client...")
try {
  execSync("npx prisma generate", { stdio: "pipe" })
  console.log("✅ Prisma client generated")
} catch (error) {
  console.log("❌ Failed to generate Prisma client")
}

// Build check
console.log("\n🏗️ Testing build...")
try {
  execSync("npm run build", { stdio: "pipe" })
  console.log("✅ Build successful")
} catch (error) {
  console.log("❌ Build failed")
  console.log("Please fix build errors before deploying")
}

console.log("\n🎉 Deployment preparation complete!")
console.log("\nNext steps:")
console.log("1. Push your code to GitHub")
console.log("2. Connect your GitHub repo to Vercel")
console.log("3. Add environment variables in Vercel dashboard")
console.log("4. Deploy!")
