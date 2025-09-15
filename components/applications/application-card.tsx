"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { JobApplication } from "@/lib/types"
import { Building, Calendar, FileText, ExternalLink, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ApplicationCardProps {
  application: JobApplication
  onEdit: (application: JobApplication) => void
  onDelete: (applicationId: string) => void
}

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "offer_received":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "interview_scheduled":
      case "interviewed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold truncate">{application.jobTitle}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Building className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{application.companyName}</span>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <Badge className={`${getStatusColor(application.status)} text-xs`}>{getStatusLabel(application.status)}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(application)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(application.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Applied {formatDistanceToNow(application.applicationDate, { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span>{application.cvFileName ? "CV uploaded" : "No CV"}</span>
          </div>
          {application.coverLetterFileName && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>Cover letter</span>
            </div>
          )}
        </div>

        {application.jobDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{application.jobDescription}</p>
        )}

        {application.notes && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm line-clamp-2">{application.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(application)} className="flex-shrink-0">
            <Edit className="h-4 w-4 mr-1" />
            <span className="hidden xs:inline">Edit</span>
          </Button>
          {application.cvFileUrl && (
            <Button variant="outline" size="sm" asChild className="flex-shrink-0">
              <a href={application.cvFileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">View CV</span>
                <span className="sm:hidden">CV</span>
              </a>
            </Button>
          )}
          {application.coverLetterFileUrl && (
            <Button variant="outline" size="sm" asChild className="flex-shrink-0">
              <a href={application.coverLetterFileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">View Cover Letter</span>
                <span className="sm:hidden">Cover</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
