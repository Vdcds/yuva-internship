'use client'

import { RequestFilters } from '@/components/request-filters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPriorityBadge } from '@/components/request-filters'
import { AdminRequestActions } from './admin-request-actions'
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
  const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    PENDING: 'secondary',
    APPROVED: 'outline',
    REJECTED: 'destructive',
  }
  return <span className={`text-xs px-2 py-1 rounded ${variants[status] === 'destructive' ? 'bg-red-100 text-red-700' : variants[status] === 'secondary' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{status}</span>
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RequestsTable({ requests }: { requests: RequestData[] }) {
  return (
    <RequestFilters requests={requests}>
      {(filteredRequests) => (
        <>
          {filteredRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No requests found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs uppercase">Citizen</TableHead>
                  <TableHead className="text-xs uppercase">Title</TableHead>
                  <TableHead className="text-xs uppercase">Category</TableHead>
                  <TableHead className="text-xs uppercase">Priority</TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="text-xs uppercase">Officer</TableHead>
                  <TableHead className="text-xs uppercase">Date</TableHead>
                  <TableHead className="text-xs uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm">
                      {req.user?.name || req.user?.email || 'User'}
                    </TableCell>
                    <TableCell className="text-sm font-medium max-w-[150px] truncate">
                      {req.title}
                    </TableCell>
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
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(req.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AdminRequestActions request={req} />
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