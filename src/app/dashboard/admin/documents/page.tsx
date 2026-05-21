import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, File, FileIcon } from 'lucide-react'

async function getAllDocuments() {
  return prisma.document.findMany({
    include: {
      request: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { uploadedAt: 'desc' },
  })
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return <File className="h-4 w-4" />
  if (fileType.toLowerCase().includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />
  if (fileType.toLowerCase().includes('image')) return <FileIcon className="h-4 w-4 text-blue-500" />
  return <File className="h-4 w-4" />
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AdminDocumentsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const documents = await getAllDocuments()

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-5">
        <div>
          <h2 className="font-didot text-xl font-bold">All Documents</h2>
          <p className="text-sm text-muted-foreground">View documents uploaded by all citizens</p>
        </div>

        <Card className="bg-card/80">
          <CardHeader className="py-3 px-4 bg-muted/30">
            <CardTitle className="text-sm font-semibold">Document Registry</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documents uploaded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase">File Name</TableHead>
                    <TableHead className="text-xs uppercase">Citizen</TableHead>
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
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{doc.request.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{doc.request.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {doc.request.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {doc.fileType?.split('/').pop()?.toUpperCase() || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </TableCell>
                      <TableCell>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 h-8 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          View
                        </a>
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
