import { prisma } from './prisma'
import { cookies } from 'next/headers'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  // Check mock auth first
  const cookieStore = await cookies()
  const mockAuth = cookieStore.get('mock_auth')

  if (mockAuth) {
    try {
      const userData = JSON.parse(mockAuth.value)
      return await prisma.user.findUnique({
        where: { clerkId: userData.id },
      })
    } catch {
      // Continue to Clerk auth
    }
  }

  // Check Clerk auth
  const { userId } = await auth()
  if (userId) {
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    // Auto-create user if webhook hasn't synced yet
    if (!user) {
      const clerkUser = await currentUser()
      const email = clerkUser?.emailAddresses[0]?.emailAddress || ''
      const name = clerkUser?.firstName
        ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
        : null

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name,
          role: 'CITIZEN',
        },
      })
    }

    return user
  }

  return null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  return user
}