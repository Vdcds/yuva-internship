import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentsTable } from '@/components/documents-table'

async function getUserDocuments(userId: string) {
  return prisma.document.findMany({
    where: { request: { userId } },
    include: { request: true },
    orderBy: { uploadedAt: 'desc' },
  })
}

export default async function DocumentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const documents = await getUserDocuments(user.id)

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div>
          <h2 className="font-didot text-xl font-bold">My Documents</h2>
          <p className="text-sm text-muted-foreground">View and download your uploaded documents</p>
        </div>

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 bg-muted/30">
            <CardTitle className="text-sm font-semibold">Document History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Documents are attached to service requests
                </p>
              </div>
            ) : (
              <DocumentsTable documents={documents} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}