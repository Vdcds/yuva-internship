import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getCurrentUser } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: '16MB', maxFileCount: 5 },
    image: { maxFileSize: '8MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('File URL:', file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
