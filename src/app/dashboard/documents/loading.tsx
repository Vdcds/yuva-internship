import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DocumentsLoading() {
  return (
    <DashboardLayout userRole="CITIZEN">
      <div className="space-y-5">
        <div>
          <div className="h-6 w-36 rounded bg-muted animate-pulse" />
          <div className="h-4 w-56 rounded bg-muted animate-pulse mt-1" />
        </div>

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 bg-muted/30">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-border/30">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}