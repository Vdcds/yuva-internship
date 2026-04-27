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
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Request {
  id: string
  title: string
  status: string
  remarks?: string | null
}

export function AdminRequestActions({ request }: { request: Request }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(request.status)
  const [remarks, setRemarks] = useState(request.remarks || '')
  const [initialStatus] = useState(request.status)

  const handleStatusChange = (value: string | null) => {
    if (value) setStatus(value as 'PENDING' | 'APPROVED' | 'REJECTED')
  }

  const handleSubmit = async () => {
    if (loading) return
    
    setLoading(true)
    
    // Optimistic update indication
    const previousStatus = initialStatus
    
    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks }),
      })

      if (!res.ok) throw new Error('Failed to update')

      const updatedRequest = await res.json()
      
      const statusMessages: Record<string, string> = {
        APPROVED: 'Request approved successfully!',
        REJECTED: 'Request has been rejected',
        PENDING: 'Request status updated to pending',
      }
      
      toast.success(statusMessages[status] || 'Status updated!', {
        description: remarks || `Request: ${request.title}`,
      })
      
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update request', {
        description: 'Please try again',
      })
      // Reset to previous status on error
      setStatus(previousStatus)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setStatus(request.status)
    setRemarks(request.remarks || '')
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        Manage
      </Button>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Request</DialogTitle>
          <DialogDescription>
            Update status for: <span className="font-medium text-foreground">{request.title}</span>
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Remarks (Optional)</Label>
            <Input
              placeholder="Add remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              'Update Status'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}