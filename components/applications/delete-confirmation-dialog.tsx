"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface DeleteConfirmationDialogProps {
  applicationId: string | null
  applicationTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmationDialog({
  applicationId,
  applicationTitle,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast()
  const { removeApplication } = useJobApplications()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!applicationId) return

    setLoading(true)
    try {
      await removeApplication(applicationId)
      toast({
        title: "Success!",
        description: "Job application has been deleted successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the application for "{applicationTitle}". This action cannot be undone and will
            also delete any uploaded files.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
