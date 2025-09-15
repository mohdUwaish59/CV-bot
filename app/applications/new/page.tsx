"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { JobApplicationForm } from "@/components/forms/job-application-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewApplicationPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="self-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Add New Application</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Track a new job application with all relevant details.</p>
            </div>
          </div>

          <JobApplicationForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
