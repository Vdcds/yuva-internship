'use client'

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, LogIn } from 'lucide-react'

export function AuthCtaButtons() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" className="px-8 h-12 text-base" disabled>
          Loading...
        </Button>
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button size="lg" className="px-8 h-12 text-base gap-2">
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/sign-in">
        <Button size="lg" className="px-8 h-12 text-base gap-2">
          Sign In
          <LogIn className="h-4 w-4" />
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="outline" size="lg" className="px-8 h-12 text-base">
          Create Account
        </Button>
      </Link>
    </div>
  )
}