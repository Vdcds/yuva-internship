import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminAppointmentActions } from './admin-appointment-actions'
import { AppointmentStatusFilter } from './appointment-status-filter'

const getCachedAllAppointments = unstable_cache(
  async (status?: string) => {
    const where = status && status !== 'ALL' ? { status: status as any } : {}
    return prisma.appointment.findMany({
      where,
      include: { user: true },
      orderBy: { date: 'asc' },
    })
  },
  ['admin-appointments'],
  { revalidate: 30 }
)

function getStatusBadge(status: string) {
  const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    SCHEDULED: 'default',
    COMPLETED: 'outline',
    CANCELLED: 'destructive',
  }
  return <Badge variant={variants[status] || 'default'}>{status}</Badge>
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminAppointmentsPage({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const { status } = await searchParams
  const appointments = await getCachedAllAppointments(status)

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">View and manage all citizen appointments</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointment List</CardTitle>
            <AppointmentStatusFilter currentStatus={status} />
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">
                        {apt.user?.name || apt.user?.email}
                      </TableCell>
                      <TableCell>{apt.department}</TableCell>
                      <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{apt.timeSlot}</TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[150px] truncate">
                        {apt.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <AdminAppointmentActions appointment={apt} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}