'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProviderBase>
  )
}