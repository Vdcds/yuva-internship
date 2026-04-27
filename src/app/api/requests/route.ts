import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requests = user.role === 'ADMIN'
    ? await prisma.serviceRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })
    : await prisma.serviceRequest.findMany({
        where: { userId: user.id },
        include: { documents: true },
        orderBy: { createdAt: 'desc' },
      })

  return NextResponse.json(requests)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, category } = body

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      title,
      description,
      category,
      userId: user.id,
      status: 'PENDING',
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/requests')
  revalidatePath('/dashboard/admin/requests')

  return NextResponse.json(serviceRequest)
}