'use client'

import { Document } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, File, FileIcon } from 'lucide-react'
import { toast } from 'sonner'

interface DocumentsTableProps {
  documents: (Document & { request: { title: string } })[]
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
    year: 'numeric'
  })
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  return (
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
  )
}