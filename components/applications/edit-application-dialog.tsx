"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useToast } from "@/hooks/use-toast"
import type { JobApplication, ApplicationStatus } from "@/lib/types"

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offer_received", label: "Offer Received" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
]

interface EditApplicationDialogProps {
  application: JobApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditApplicationDialog({ application, open, onOpenChange }: EditApplicationDialogProps) {
  const { toast } = useToast()
  const { updateApplication } = useJobApplications()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    applicationDate: "",
    status: "applied" as ApplicationStatus,
    notes: "",
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)

  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        jobDescription: application.jobDescription,
        applicationDate: application.applicationDate.toISOString().split("T")[0],
        status: application.status,
        notes: application.notes || "",
      })
      setCvFile(null)
      setCoverLetterFile(null)
    }
  }, [application])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!application) return

    setLoading(true)

    try {
      const updateData: any = {
        id: application.id,
        ...formData,
        applicationDate: new Date(formData.applicationDate),
      }

      // Only include file fields if they have values
      if (cvFile) {
        updateData.cvFile = cvFile
      }
      if (coverLetterFile) {
        updateData.coverLetterFile = coverLetterFile
      }

      await updateApplication(updateData)

      toast({
        title: "Success!",
        description: "Job application has been updated successfully.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>Update the details of your job application.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-jobTitle">Job Title *</Label>
              <Input
                id="edit-jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-companyName">Company Name *</Label>
              <Input
                id="edit-companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-jobDescription">Job Description</Label>
            <Textarea
              id="edit-jobDescription"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-applicationDate">Application Date *</Label>
              <Input
                id="edit-applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CV / Resume</Label>
              <FileUpload
                label="CV / Resume"
                description={
                  application?.cvFileName
                    ? `Current: ${application.cvFileName} (upload new file to replace)`
                    : "PDF, DOC, or DOCX files only"
                }
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
                description={
                  application?.coverLetterFileName
                    ? `Current: ${application.coverLetterFileName} (upload new file to replace)`
                    : "PDF, DOC, or DOCX files only"
                }
                accept=".pdf,.doc,.docx"
                maxSize={10}
                onFileSelect={setCoverLetterFile}
                currentFile={coverLetterFile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Additional Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Application"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
