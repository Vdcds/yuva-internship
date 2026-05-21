'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, User, Shield } from 'lucide-react'

const mockUsers = [
  { id: 'admin_001', name: 'Administrator', email: 'admin@egovernance.gov', role: 'ADMIN' },
  { id: 'citizen_001', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', role: 'CITIZEN' },
  { id: 'citizen_002', name: 'Priya Verma', email: 'priya.verma@yahoo.com', role: 'CITIZEN' },
  { id: 'citizen_003', name: 'Amit Kumar', email: 'amit.kumar@outlook.com', role: 'CITIZEN' },
]

export default function MockLoginPage() {
  const router = useRouter()

  const handleLogin = (user: typeof mockUsers[0]) => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    document.cookie = `mock_auth=${JSON.stringify(user)};path=/;expires=${expires.toUTCString()}`
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-didot text-2xl">Mock Login</CardTitle>
          <CardDescription>Select a user to test with seeded data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  {user.role === 'ADMIN' ? (
                    <Shield className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </button>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button variant="ghost" onClick={() => router.push('/sign-in')}>
              Use Real Sign In →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}