"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApplicationStats } from "@/hooks/use-job-applications"
import { Plus, FileText, Briefcase, TrendingUp, Clock, CheckCircle, ArrowRight, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { stats, loading } = useApplicationStats()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Track your job applications and monitor your progress at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {loading ? "..." : stats?.totalApplications || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats?.totalApplications === 0 ? "No applications yet" : "Applications submitted"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {loading ? "..." : stats?.totalApplications > 0 ? `${stats.successRate}%` : "0%"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats?.totalApplications === 0 ? "Start tracking to see stats" : "Offer received rate"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {loading ? "..." : stats?.statusCounts?.under_review || 0}
                </div>
                <p className="text-sm text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {loading
                    ? "..."
                    : (stats?.statusCounts?.interview_scheduled || 0) + (stats?.statusCounts?.interviewed || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Scheduled + completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/applications/new" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-3 text-sm sm:text-base px-4 sm:px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Add New Application</span>
                <span className="xs:hidden">Add Application</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/applications" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
              >
                <span className="hidden xs:inline">View All Applications</span>
                <span className="xs:hidden">View All</span>
              </Button>
            </Link>
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : stats?.recentApplications?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentApplications.map((application: any) => (
                    <div key={application.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{application.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground truncate">{application.companyName}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied on {application.applicationDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-start sm:justify-end">
                        <span
                          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            application.status === "offer_received"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : application.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : application.status === "interview_scheduled"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {application.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Start tracking your job applications to see them here.</p>
                  <Link href="/applications/new">
                    <Button>Add Your First Application</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {(!stats || stats.totalApplications === 0) && (
            <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Getting Started</CardTitle>
                <CardDescription className="text-base">
                  Follow these steps to start tracking your job applications effectively.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Add your first job application",
                    description: "Include job title, company, and description",
                  },
                  {
                    step: 2,
                    title: "Upload your CV and cover letter",
                    description: "Keep track of which documents you used for each application",
                  },
                  {
                    step: 3,
                    title: "Monitor your progress",
                    description: "Track application status and analyze your success rate",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
