import 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    name: string | null
    email: string
    role: Role
    emailVerified: Date | null
  }

  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      role: Role
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string
    role: Role
  }
} 