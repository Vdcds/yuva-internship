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

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

export function AdminDashboardCharts({ stats, categoryData }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-xl p-4 border h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading charts...</p>
        </div>
        <div className="bg-card/50 rounded-xl p-4 border h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading charts...</p>
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