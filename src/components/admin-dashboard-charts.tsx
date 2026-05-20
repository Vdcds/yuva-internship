'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface StatsData {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface CategoryData {
  name: string
  value: number
}

interface Props {
  stats: StatsData
  categoryData: CategoryData[]
}

export function AdminDashboardCharts({ stats, categoryData }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If component isn't mounted yet or data is empty, show skeletons
  if (!isMounted || (stats.total === 0 && stats.pending === 0 && stats.approved === 0 && stats.rejected === 0)) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-xl p-4 border min-h-[250px] relative">
          <h3 className="font-semibold text-sm mb-4">Request Status Distribution</h3>
          <div className="h-[200px] w-full">
            <div className="absolute inset-0 animate-pulse bg-card/50 rounded" style={{ minHeight: '200px' }}></div>
          </div>
        </div>

        <div className="bg-card/50 rounded-xl p-4 border min-h-[250px] relative">
          <h3 className="font-semibold text-sm mb-4">Requests by Category</h3>
          <div className="h-[200px] w-full">
            <div className="absolute inset-0 animate-pulse bg-card/50 rounded" style={{ minHeight: '200px' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Check if we have valid data for charts
  const hasValidData = 
    stats.total > 0 || 
    stats.pending > 0 || 
    stats.approved > 0 || 
    stats.rejected > 0 ||
    (categoryData && categoryData.length > 0 && categoryData.some(item => item.value > 0))

  if (!hasValidData) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-xl p-4 border min-h-[250px] relative">
          <h3 className="font-semibold text-sm mb-4">Request Status Distribution</h3>
          <div className="h-[200px] w-full">
            <div className="absolute inset-0 animate-pulse bg-card/50 rounded" style={{ minHeight: '200px' }}></div>
          </div>
        </div>

        <div className="bg-card/50 rounded-xl p-4 border min-h-[250px] relative">
          <h3 className="font-semibold text-sm mb-4">Requests by Category</h3>
          <div className="h-[200px] w-full">
            <div className="absolute inset-0 animate-pulse bg-card/50 rounded" style={{ minHeight: '200px' }}></div>
          </div>
        </div>
      </div>
    )
  }

  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-card/50 rounded-xl p-4 border min-h-[250px]">
        <h3 className="font-semibold text-sm mb-4">Request Status Distribution</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card/50 rounded-xl p-4 border min-h-[250px]">
        <h3 className="font-semibold text-sm mb-4">Requests by Category</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#5856d6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

