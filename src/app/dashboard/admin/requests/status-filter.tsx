'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function StatusFilter({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string | null) => {
    if (!value) return
    const params = new URLSearchParams(searchParams)
    if (value === 'ALL') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`/dashboard/admin/requests?${params.toString()}`)
  }

  return (
    <Select value={currentStatus || 'ALL'} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All</SelectItem>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="APPROVED">Approved</SelectItem>
        <SelectItem value="REJECTED">Rejected</SelectItem>
      </SelectContent>
    </Select>
  )
}