"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getUserJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getApplicationStats,
} from "@/lib/firestore"
import type { JobApplication, CreateJobApplicationData, UpdateJobApplicationData } from "@/lib/types"

export function useJobApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userApplications = await getUserJobApplications(user.uid)
      setApplications(userApplications)
      setError(null)
    } catch (err) {
      setError("Failed to fetch applications")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [user])

  const addApplication = async (data: CreateJobApplicationData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      await createJobApplication(user.uid, data)
      await fetchApplications() // Refresh the list
    } catch (err) {
      setError("Failed to create application")
      throw err
    }
  }

  const updateApplication = async (data: UpdateJobApplicationData) => {
    try {
      await updateJobApplication(data)
      await fetchApplications() // Refresh the list
    } catch (err) {
      setError("Failed to update application")
      throw err
    }
  }

  const removeApplication = async (applicationId: string) => {
    try {
      await deleteJobApplication(applicationId)
      await fetchApplications() // Refresh the list
    } catch (err) {
      setError("Failed to delete application")
      throw err
    }
  }

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    removeApplication,
    refreshApplications: fetchApplications,
  }
}

export function useApplicationStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setLoading(true)
        const applicationStats = await getApplicationStats(user.uid)
        setStats(applicationStats)
        setError(null)
      } catch (err) {
        setError("Failed to fetch statistics")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  return { stats, loading, error }
}
