import { prisma } from './prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const mockAuth = cookieStore.get('mock_auth')

  if (mockAuth) {
    try {
      const userData = JSON.parse(mockAuth.value)
      return await prisma.user.findUnique({
        where: { clerkId: userData.id },
      })
    } catch {
      return null
    }
  }

  return null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/mock-login')
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