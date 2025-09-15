"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { ApplicationStatus } from "@/lib/types"

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offer_received", label: "Offer Received" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
]

export function JobApplicationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { addApplication } = useJobApplications()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    applicationDate: new Date().toISOString().split("T")[0],
    status: "applied" as ApplicationStatus,
    notes: "",
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addApplication({
        ...formData,
        applicationDate: new Date(formData.applicationDate),
        cvFile: cvFile || undefined,
        coverLetterFile: coverLetterFile || undefined,
      })

      toast({
        title: "Success!",
        description: "Job application has been saved successfully.",
      })

      router.push("/applications")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Enter the basic information about the job you applied for.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="e.g. Google"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Application Date *</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Upload the CV and cover letter you used for this application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>CV / Resume</Label>
            <FileUpload
              label="CV / Resume"
              description="PDF, DOC, or DOCX files only"
              accept=".pdf,.doc,.docx"
              maxSize={10}
              onFileSelect={setCvFile}
              currentFile={cvFile}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <FileUpload
              label="Cover Letter"
              description="PDF, DOC, or DOCX files only"
              accept=".pdf,.doc,.docx"
              maxSize={10}
              onFileSelect={setCoverLetterFile}
              currentFile={coverLetterFile}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Add any additional information or notes about this application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="e.g. Applied through LinkedIn, contacted by recruiter, etc."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
          {loading ? "Saving..." : "Save Application"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} size="lg" className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  )
}
