export interface JobApplication {
  id: string
  userId: string
  jobTitle: string
  companyName: string
  jobDescription: string
  applicationDate: Date
  status: ApplicationStatus
  cvFileUrl?: string
  cvFileName?: string
  coverLetterFileUrl?: string
  coverLetterFileName?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "interview_scheduled"
  | "interviewed"
  | "offer_received"
  | "rejected"
  | "withdrawn"

export interface CreateJobApplicationData {
  jobTitle: string
  companyName: string
  jobDescription: string
  applicationDate: Date
  status: ApplicationStatus
  cvFile?: File
  coverLetterFile?: File
  notes?: string
}

export interface UpdateJobApplicationData {
  id: string
  jobTitle: string
  companyName: string
  jobDescription: string
  applicationDate: Date
  status: ApplicationStatus
  notes?: string
  cvFile?: File
  coverLetterFile?: File
}
