"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Briefcase, Chrome } from 'lucide-react'

export default function ExtensionAuthSuccessPage() {
  useEffect(() => {
    // Auto-close the tab after 3 seconds
    const timer = setTimeout(() => {
      window.close()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                <Chrome className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">Authentication Successful!</CardTitle>
          <CardDescription>
            Your Chrome extension is now connected to CV Tracker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              You can now use the CV Tracker extension to save job applications directly from LinkedIn.
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>This window will close automatically in a few seconds.</p>
            <p className="mt-2">Return to LinkedIn to start using the extension!</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>CV Tracker Extension Connected</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}