import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Calendar, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats(userId: string, role: string) {
  const where = role === 'ADMIN' ? {} : { userId }
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.serviceRequest.count({ where }),
    prisma.serviceRequest.count({ where: { ...where, status: 'PENDING' } }),
    prisma.serviceRequest.count({ where: { ...where, status: 'APPROVED' } }),
    prisma.serviceRequest.count({ where: { ...where, status: 'REJECTED' } }),
  ])
  return { total, pending, approved, rejected }
}

async function getRecentRequests(userId: string, role: string) {
  const where = role === 'ADMIN' ? {} : { userId }
  return prisma.serviceRequest.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

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
}

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

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const [stats, recentRequests, upcomingAppointments] = await Promise.all([
    getStats(user.id, user.role),
    getRecentRequests(user.id, user.role),
    getUpcomingAppointments(user.id, user.role),
  ])

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <StatCard icon={FileText} label="Total" value={stats.total} color="bg-primary/10 text-primary" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-500/10 text-amber-600" />
          <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="bg-emerald-500/10 text-emerald-600" />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="bg-rose-500/10 text-rose-600" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
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
                          {user.role === 'ADMIN' ? `${req.user?.name || req.user?.email || 'User'}` : req.title}
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
        </div>
      </div>
    </DashboardLayout>
  )
}