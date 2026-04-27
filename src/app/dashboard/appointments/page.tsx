import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CreateAppointmentDialog } from './create-appointment-dialog'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserAppointments(userId: string) {
  return prisma.appointment.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  })
}

function getStatusBadge(status: string) {
  const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    SCHEDULED: 'default',
    COMPLETED: 'outline',
    CANCELLED: 'destructive',
  }
  return <Badge variant={variants[status] || 'default'} className="text-xs">{status}</Badge>
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AppointmentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const appointments = await getUserAppointments(user.id)

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-didot text-xl font-bold">My Appointments</h2>
            <p className="text-sm text-muted-foreground">View and manage your scheduled appointments</p>
          </div>
          <CreateAppointmentDialog />
        </div>

        <Card className="bg-card/80">
          <CardContent className="p-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase">Department</TableHead>
                    <TableHead className="text-xs uppercase">Date</TableHead>
                    <TableHead className="text-xs uppercase">Time</TableHead>
                    <TableHead className="text-xs uppercase">Status</TableHead>
                    <TableHead className="text-xs uppercase">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-sm">{apt.department}</TableCell>
                      <TableCell className="text-sm">{formatDate(apt.date)}</TableCell>
                      <TableCell className="text-sm">{apt.timeSlot}</TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {apt.notes || '-'}
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