import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, notes } = body

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      status,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')
  revalidatePath('/dashboard/admin/appointments')

  return NextResponse.json(appointment)
}