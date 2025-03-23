import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { redirect } from "next/navigation"
import { userService } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await userService.findByEmail(credentials.email)

          if (!user) {
            console.log(`No user found with email: ${credentials.email}`)
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log(`Password verification failed for user: ${credentials.email}`)
            return null
          }

          console.log(`Authentication successful for user: ${credentials.email}, role: ${user.role}`)

          // Return user data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Helper function to require authentication
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || "")}`)
  }

  return session.user
}

// Helper function to get current user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

// Helper function to require admin authentication
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/admin")
  }

  // Check for both uppercase and lowercase "admin" to handle potential inconsistencies
  if (session.user.role !== "ADMIN" && session.user.role !== "admin") {
    redirect("/dashboard?error=access_denied")
  }

  return session.user
}

