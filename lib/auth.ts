import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "./db"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials Provider for email/password login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await getUserByEmail(credentials.email)

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),

    // Google OAuth Provider - only include if environment variables are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token
        token.role = user.role || "customer"
      }

      return token
    },

    async session({ session, token, user }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.accessToken = token.accessToken
      }

      // If using database sessions
      if (user) {
        session.user.id = user.id
        session.user.role = (user as any).role || "customer"
      }

      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Allow OAuth sign-ins
      if (account?.provider === "google") {
        try {
          // Check if user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // User exists - check if they already have a Google account linked
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              },
            })

            if (!existingAccount) {
              // Link the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              })

              // Update user profile with Google info if needed
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  image: user.image || existingUser.image,
                  emailVerified: true,
                },
              })
            }

            // Return true to allow sign in
            return true
          } else {
            // Create new user for Google OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                role: "CUSTOMER",
                provider: account.provider,
                providerId: account.providerAccountId,
                emailVerified: true,
                image: user.image,
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
          }

          return true
        } catch (error) {
          console.error("Google OAuth sign-in error:", error)
          return false
        }
      }

      // Allow credentials sign-in
      if (account?.provider === "credentials") {
        return true
      }

      return true
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Add debug mode for development
  debug: process.env.NODE_ENV === "development",
}
