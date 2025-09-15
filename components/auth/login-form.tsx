"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Chrome } from "lucide-react"

export function LoginForm() {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">CV-bot</CardTitle>
          <CardDescription className="text-muted-foreground">
            Track your job applications and CVs efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} disabled={loading} className="w-full flex items-center gap-2" size="lg">
            <Chrome className="h-5 w-5" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">Secure authentication powered by Google</p>
        </CardContent>
      </Card>
    </div>
  )
}
