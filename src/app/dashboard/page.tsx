import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Calendar, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { unstable_cache } from 'next/cache'

const getStats = unstable_cache(
  async function getStats(userId: string, role: string) {
    const where = role === 'ADMIN' ? {} : { userId }
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.serviceRequest.count({ where }),
      prisma.serviceRequest.count({ where: { ...where, status: 'PENDING' } }),
      prisma.serviceRequest.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.serviceRequest.count({ where: { ...where, status: 'REJECTED' } }),
    ])
    return { total, pending, approved, rejected }
  },
  ['dashboard-stats'],
  {
    revalidate: 60,
    tags: ['dashboard-stats'],
  }
)

const getRecentRequests = unstable_cache(
  async function getRecentRequests(userId: string, role: string) {
    const where = role === 'ADMIN' ? {} : { userId }
    return prisma.serviceRequest.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  },
  ['dashboard-recent-requests'],
  {
    revalidate: 30,
    tags: ['dashboard-recent-requests'],
  }
)

const getUpcomingAppointments = unstable_cache(
  async function getUpcomingAppointments(userId: string, role: string) {
    const now = new Date()
    const where = role === 'ADMIN' 
      ? { date: { gte: now }, status: 'SCHEDULED' as const }
      : { userId, date: { gte: now }, status: 'SCHEDULED' as const }
    return prisma.appointment.findMany({
      where,
      include: { user: true },
      orderBy: { date: 'asc' },
      take: 4,
    })
  },
  ['dashboard-upcoming-appointments'],
  {
    revalidate: 30,
    tags: ['dashboard-upcoming-appointments'],
  }
)

function getStatusBadge(status: string) {
  const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    PENDING: 'secondary',
    APPROVED: 'outline',
    REJECTED: 'destructive',
    SCHEDULED: 'default',
    COMPLETED: 'outline',
    CANCELLED: 'destructive',
  }
  return <Badge variant={variants[status] || 'default'} className="text-xs">{status}</Badge>
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <Card className="bg-card/80">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold font-didot mt-0.5">{value}</p>
          </div>
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function StatsCards({ userId, role }: { userId: string, role: string }) {
  const stats = await getStats(userId, role)
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <StatCard icon={FileText} label="Total" value={stats.total} color="bg-primary/10 text-primary" />
      <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-500/10 text-amber-600" />
      <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="bg-emerald-500/10 text-emerald-600" />
      <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="bg-rose-500/10 text-rose-600" />
    </div>
  )
}

async function RecentRequestsList({ userId, role }: { userId: string, role: string }) {
  const recentRequests = await getRecentRequests(userId, role)
  return (
    <Card className="bg-card/80">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
        <CardTitle className="text-sm font-semibold">Recent Requests</CardTitle>
        <Link href="/dashboard/requests" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="py-2 px-4">
        {recentRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No requests yet</p>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {role === 'ADMIN' ? `${req.user?.name || req.user?.email || 'User'}` : req.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{req.category}</span>
                    <span>•</span>
                    <span>{formatDate(req.createdAt)}</span>
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function UpcomingAppointmentsList({ userId, role }: { userId: string, role: string }) {
  const upcomingAppointments = await getUpcomingAppointments(userId, role)
  return (
    <Card className="bg-card/80">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
        <CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle>
        <Link href="/dashboard/appointments" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="py-2 px-4">
        {upcomingAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No upcoming appointments</p>
        ) : (
          <div className="space-y-2">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{apt.department}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(apt.date)}</span>
                    <span>•</span>
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>
                {getStatusBadge(apt.status)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="font-didot text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {user.name || user.email}
              <span className="mx-1.5">•</span>
              <span className="text-primary font-medium">{user.role}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/requests">
              <Button size="sm" className="gap-1.5 h-8">
                <Plus className="h-3.5 w-3.5" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <StatsCards userId={user.id} role={user.role} />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <RecentRequestsList userId={user.id} role={user.role} />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <UpcomingAppointmentsList userId={user.id} role={user.role} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="bg-card/80">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                <div className="h-6 w-8 rounded bg-muted animate-pulse mt-1" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ListSkeleton() {
  return (
    <Card className="bg-card/80">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent className="py-2 px-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                <div className="h-3 w-28 rounded bg-muted animate-pulse mt-1" />
              </div>
              <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}