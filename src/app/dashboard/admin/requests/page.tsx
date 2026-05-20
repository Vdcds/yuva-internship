import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusFilter } from './status-filter'
import { AdminDashboardCharts } from '@/components/admin-dashboard-charts'
import { RequestsTable } from './requests-table'
import { unstable_cache } from 'next/cache'


const getAllRequests = unstable_cache(
  async function getAllRequests(status?: string) {
    const where = status && status !== 'ALL' ? { status: status as any } : {}
    return prisma.serviceRequest.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 100, // Add limit to prevent loading too many records
    })
  },
  ['all-requests'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['all-requests'],
  }
)

const getStats = unstable_cache(
  async function getStats() {
    const [total, pending, approved, rejected, categoryData] = await Promise.all([
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
      prisma.serviceRequest.count({ where: { status: 'APPROVED' } }),
      prisma.serviceRequest.count({ where: { status: 'REJECTED' } }),
      prisma.serviceRequest.groupBy({
        by: ['category'],
        _count: true,
      }),
    ])

    return {
      total,
      pending,
      approved,
      rejected,
      categoryData: categoryData.map(c => ({ name: c.category, value: c._count })),
    }
  },
  ['admin-dashboard-stats'],
  {
    revalidate: 30, // Revalidate every 30 seconds
    tags: ['admin-dashboard-stats'],
  }
)

interface RequestData {
  id: string
  title: string
  category: string
  status: string
  priority: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
  user: { name: string | null; email: string }
  remarks: string | null
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminRequestsPage({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const { status } = await searchParams
  const [requests, stats] = await Promise.all([
    getAllRequests(status),
    getStats(),
  ])

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div>
          <h2 className="font-didot text-xl font-bold">All Requests</h2>
          <p className="text-sm text-muted-foreground">Manage and review citizen service requests</p>
        </div>

        <AdminDashboardCharts stats={stats} categoryData={stats.categoryData} />

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
            <CardTitle className="text-sm font-semibold">Request List</CardTitle>
            <StatusFilter currentStatus={status} />
          </CardHeader>
          <CardContent className="p-4">
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No requests for admin users</p>
            ) : (
              <RequestsTable requests={requests as RequestData[]} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}