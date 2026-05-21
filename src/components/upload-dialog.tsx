'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateUploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'

const UploadDropzone = generateUploadDropzone<OurFileRouter>()
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'

interface UploadDialogProps {
  requestOptions: { id: string; title: string }[]
}

export function UploadDialog({ requestOptions }: UploadDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUploadComplete = async (res: { url: string; name: string; size: number; type?: string; key: string; customMetadata?: Record<string, unknown> }[]) => {
    if (!selectedRequest) {
      toast.error('Please select a request first')
      return
    }

    setUploading(true)

    try {
      const promises = res.map(async (file) => {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileUrl: file.url,
            fileType: file.type || 'application/octet-stream',
            requestId: selectedRequest,
          }),
        })

        if (!response.ok) throw new Error(`Failed to save ${file.name}`)
        return response.json()
      })

      await Promise.all(promises)

      toast.success('Documents uploaded successfully!', {
        description: `${res.length} file(s) uploaded`,
      })

      setOpen(false)
      setSelectedRequest('')
      router.refresh()
    } catch (error) {
      toast.error('Failed to save documents', {
        description: 'Files were uploaded but could not be linked to your request',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUploadError = (error: Error) => {
    toast.error('Upload failed', {
      description: error.message || 'Please try again',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Upload className="h-3.5 w-3.5" />
        Upload Documents
      </Button>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Attach documents to one of your service requests
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="request">Service Request *</Label>
            <Select value={selectedRequest} onValueChange={(v) => v && setSelectedRequest(v)} disabled={uploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a request" />
              </SelectTrigger>
              <SelectContent>
                {requestOptions.map((req) => (
                  <SelectItem key={req.id} value={req.id}>{req.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Files</Label>
            <UploadDropzone
              endpoint="documentUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              appearance={{
                container: 'border-2 border-dashed rounded-lg p-4',
                allowedContent: 'text-xs text-muted-foreground',
              }}
              disabled={!selectedRequest || uploading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
