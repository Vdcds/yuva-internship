'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, SortAsc, SortDesc } from 'lucide-react'

interface Request {
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

interface RequestFiltersProps {
  requests: Request[]
  children: (filtered: Request[]) => React.ReactNode
}

const categories = ['All', 'Transport', 'Tax', 'Utilities', 'Legal', 'Documents', 'Business', 'Health', 'Education', 'Land Records', 'Other']
const statuses = ['All', 'PENDING', 'APPROVED', 'REJECTED']

export function RequestFilters({ requests, children }: RequestFiltersProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest')

  const filtered = useMemo(() => {
    let result = [...requests]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        r => r.title.toLowerCase().includes(searchLower) || 
             r.category.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter(r => r.category === category)
    }

    // Status filter
    if (status !== 'All') {
      result = result.filter(r => r.status === status)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        const statusOrder = { PENDING: 0, APPROVED: 1, REJECTED: 2 }
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
      }
    })

    return result
  }, [requests, search, category, status, sortBy])

  const hasFilters = search || category !== 'All' || status !== 'All'

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setStatus('All')
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={category} onValueChange={(v) => setCategory(v || '')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v || '')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <Button 
            variant={sortBy === 'newest' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setSortBy('newest')}
            title="Newest first"
          >
            <SortDesc className="h-4 w-4" />
          </Button>
          <Button 
            variant={sortBy === 'oldest' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setSortBy('oldest')}
            title="Oldest first"
          >
            <SortAsc className="h-4 w-4" />
          </Button>
          <Button 
            variant={sortBy === 'status' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setSortBy('status')}
            title="Sort by status"
          >
            <span className="text-xs font-bold">S</span>
          </Button>
        </div>
      </div>

      {/* Active filters badge */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered:</span>
          <Badge variant="secondary" className="gap-1">
            {filtered.length} of {requests.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Render filtered results */}
      {children(filtered)}
    </div>
  )
}

export function getPriorityBadge(priority: string) {
  const variants: Record<string, 'destructive' | 'secondary' | 'default'> = {
    HIGH: 'destructive',
    MEDIUM: 'secondary',
    LOW: 'default',
  }
  return <Badge variant={variants[priority] || 'default'} className="text-xs">{priority}</Badge>
}