import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appointments = user.role === 'ADMIN'
    ? await prisma.appointment.findMany({
        include: { user: true },
        orderBy: { date: 'asc' },
      })
    : await prisma.appointment.findMany({
        where: { userId: user.id },
        orderBy: { date: 'asc' },
      })

  return NextResponse.json(appointments)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { department, date, timeSlot, notes } = body

const appointment = await prisma.appointment.create({
      data: {
        department,
        date: new Date(date),
        timeSlot,
        notes: notes || null,
        userId: user.id,
        status: 'SCHEDULED',
      },
    })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')
  revalidatePath('/dashboard/admin/appointments')

  return NextResponse.json(appointment)
}