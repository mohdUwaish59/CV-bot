"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApplicationCard } from "@/components/applications/application-card"
import { EditApplicationDialog } from "@/components/applications/edit-application-dialog"
import { DeleteConfirmationDialog } from "@/components/applications/delete-confirmation-dialog"
import { useJobApplications } from "@/hooks/use-job-applications"
import { Plus, Search, Filter, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import type { JobApplication, ApplicationStatus } from "@/lib/types"

export default function ApplicationsPage() {
  const { applications, loading } = useJobApplications()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [deletingApplication, setDeletingApplication] = useState<{
    id: string
    title: string
  } | null>(null)

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || app.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application)
  }

  const handleDelete = (applicationId: string) => {
    const application = applications.find((app) => app.id === applicationId)
    if (application) {
      setDeletingApplication({
        id: applicationId,
        title: `${application.jobTitle} at ${application.companyName}`,
      })
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">All Applications</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Manage and track all your job applications in one place.</p>
            </div>
            <Link href="/applications/new" className="flex-shrink-0">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Add Application</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="offer_received">Offer Received</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your job applications by adding your first application.
                </p>
                <Link href="/applications/new">
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Application
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No applications found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Dialog */}
        <EditApplicationDialog
          application={editingApplication}
          open={!!editingApplication}
          onOpenChange={(open) => !open && setEditingApplication(null)}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          applicationId={deletingApplication?.id || null}
          applicationTitle={deletingApplication?.title || ""}
          open={!!deletingApplication}
          onOpenChange={(open) => !open && setDeletingApplication(null)}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
