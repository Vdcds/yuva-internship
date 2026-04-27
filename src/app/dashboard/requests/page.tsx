import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { CreateRequestDialog } from './create-request-dialog'
import { RequestsList } from './requests-list'

export const dynamic = 'force-dynamic'

async function getUserRequests(userId: string) {
  return prisma.serviceRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

interface RequestData {
  id: string
  title: string
  category: string
  status: string
  priority: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
}

export default async function RequestsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const requests = await getUserRequests(user.id)

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-didot text-xl font-bold">My Requests</h2>
            <p className="text-sm text-muted-foreground">Track and manage your service requests</p>
          </div>
          <CreateRequestDialog />
        </div>

        <Card className="bg-card/80">
          <CardContent className="p-4">
            <RequestsList requests={requests as RequestData[]} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}