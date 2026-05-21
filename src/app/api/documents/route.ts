import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { fileName, fileUrl, fileType, requestId } = body

  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  })

  if (!serviceRequest || serviceRequest.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const document = await prisma.document.create({
    data: {
      fileName,
      fileUrl,
      fileType,
      requestId,
    },
  })

  revalidatePath('/dashboard/documents')
  revalidatePath('/dashboard/requests')

  return NextResponse.json(document)
}
