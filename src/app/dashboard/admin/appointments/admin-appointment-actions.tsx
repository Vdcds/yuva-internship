'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Appointment {
  id: string
  department: string
  status: string
  notes: string | null
}

export function AdminAppointmentActions({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || '')
  const [initialStatus] = useState(appointment.status)

  const handleStatusChange = (value: string | null) => {
    if (value) setStatus(value as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED')
  }

  const handleSubmit = async () => {
    if (loading) return
    
    setLoading(true)

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })

      if (!res.ok) throw new Error('Failed to update')

      const statusMessages: Record<string, string> = {
        COMPLETED: 'Appointment marked as completed!',
        CANCELLED: 'Appointment has been cancelled',
        SCHEDULED: 'Appointment rescheduled',
      }
      
      toast.success(statusMessages[status] || 'Appointment updated!', {
        description: `${appointment.department}`,
      })
      
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Failed to update appointment', {
        description: 'Please try again',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setStatus(appointment.status)
    setNotes(appointment.notes || '')
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        Manage
      </Button>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Appointment</DialogTitle>
          <DialogDescription>
            Update status for: <span className="font-medium text-foreground">{appointment.department}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select 
              value={status} 
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Notes (Optional)</Label>
            <Input
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || status === initialStatus}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}