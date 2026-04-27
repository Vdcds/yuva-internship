import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, File, FileIcon } from 'lucide-react'
import { toast } from 'sonner'

async function getUserDocuments(userId: string) {
  return prisma.document.findMany({
    where: { request: { userId } },
    include: { request: true },
    orderBy: { uploadedAt: 'desc' },
  })
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return <File className="h-4 w-4" />
  if (fileType.toLowerCase().includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />
  if (fileType.toLowerCase().includes('image')) return <FileIcon className="h-4 w-4 text-blue-500" />
  return <File className="h-4 w-4" />
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
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Documents are attached to service requests
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase">File Name</TableHead>
                    <TableHead className="text-xs uppercase">Request</TableHead>
                    <TableHead className="text-xs uppercase">Type</TableHead>
                    <TableHead className="text-xs uppercase">Uploaded</TableHead>
                    <TableHead className="text-xs uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.fileType)}
                          <span className="text-sm font-medium">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {doc.request.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {doc.fileType || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={() => {
                            toast.success('Download started', {
                              description: doc.fileName,
                            })
                          }}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="text-xs">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}