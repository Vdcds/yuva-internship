'use client'

import { RequestFilters } from '@/components/request-filters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPriorityBadge } from '@/components/request-filters'
import { User, Clock } from 'lucide-react'

interface RequestData {
  id: string
  title: string
  category: string
  status: string
  priority: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
  user?: { name: string | null; email: string }
  remarks?: string | null
}

function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }
  return <span className={`text-xs px-2 py-1 rounded ${variants[status] || 'bg-gray-100'}`}>{status}</span>
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RequestsList({ requests }: { requests: RequestData[] }) {
  return (
    <RequestFilters requests={requests}>
      {(filteredRequests) => (
        <>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No requests found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs uppercase">Title</TableHead>
                  <TableHead className="text-xs uppercase">Category</TableHead>
                  <TableHead className="text-xs uppercase">Priority</TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="text-xs uppercase">Officer</TableHead>
                  <TableHead className="text-xs uppercase">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-sm">{req.title}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {req.category}
                      </span>
                    </TableCell>
                    <TableCell>{getPriorityBadge(req.priority)}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {req.assignedTo || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(req.createdAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </RequestFilters>
  )
}