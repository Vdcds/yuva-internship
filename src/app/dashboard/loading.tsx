import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <DashboardLayout userRole="CITIZEN">
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="h-6 w-32 rounded bg-muted animate-pulse" />
            <div className="h-4 w-48 rounded bg-muted animate-pulse mt-2" />
          </div>
          <div className="h-8 w-28 rounded bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card/80">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-6 w-8 rounded bg-muted animate-pulse mt-1" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-28 rounded bg-muted animate-pulse mt-1" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-24 rounded bg-muted animate-pulse mt-1" />
                  </div>
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