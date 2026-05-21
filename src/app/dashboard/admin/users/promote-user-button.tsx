'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PromoteUserButtonProps {
  userId: string
  currentRole: 'ADMIN' | 'CITIZEN'
  currentUserId: string
}

export function PromoteUserButton({ userId, currentRole, currentUserId }: PromoteUserButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isAdmin = currentRole === 'ADMIN'
  const isSelf = userId === currentUserId
  const targetRole = isAdmin ? 'CITIZEN' : 'ADMIN'
  const buttonLabel = isAdmin ? 'Demote' : 'Promote'

  async function handleToggleRole() {
    if (isAdmin && isSelf) {
      return
    }

    const confirmed = window.confirm(
      isAdmin
        ? 'Are you sure you want to demote this admin to a citizen?'
        : 'Are you sure you want to promote this citizen to admin?'
    )

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: targetRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.error || 'Unable to update role')
      }

      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant={isAdmin ? 'outline' : 'secondary'}
        onClick={handleToggleRole}
        disabled={isSaving || (isAdmin && isSelf)}
      >
        {isSaving ? 'Saving...' : buttonLabel}
      </Button>
      {isAdmin && isSelf ? (
        <p className="text-xs text-muted-foreground">You cannot demote yourself.</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
