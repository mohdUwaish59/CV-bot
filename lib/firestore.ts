import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  type Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { getFirebaseFirestore, getFirebaseStorage, getFirebaseAuth } from "./firebase"
import type { JobApplication, CreateJobApplicationData, UpdateJobApplicationData } from "./types"

const COLLECTION_NAME = "jobApplications"

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp): Date => {
  return timestamp.toDate()
}

// Convert JobApplication data from Firestore
const convertJobApplicationData = (data: any): JobApplication => {
  return {
    ...data,
    applicationDate: convertTimestamp(data.applicationDate),
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  }
}

// Upload file to Firebase Storage
const uploadFile = async (
  file: File,
  userId: string,
  applicationId: string,
  fileType: "cv" | "coverLetter",
): Promise<{ url: string; fileName: string }> => {
  const storage = getFirebaseStorage()
  if (!storage) {
    throw new Error("Firebase Storage not initialized")
  }

  const fileName = `${Date.now()}_${file.name}`
  const filePath = `users/${userId}/applications/${applicationId}/${fileType}/${fileName}`
  const storageRef = ref(storage, filePath)

  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)

  return { url, fileName }
}

// Delete file from Firebase Storage
const deleteFile = async (fileUrl: string) => {
  try {
    const storage = getFirebaseStorage()
    if (!storage) {
      console.error("Firebase Storage not initialized")
      return
    }

    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
  } catch (error) {
    console.error("Error deleting file:", error)
  }
}

// Create a new job application
export const createJobApplication = async (userId: string, data: CreateJobApplicationData): Promise<string> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not initialized")
    }



    const applicationData = {
      userId,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      jobDescription: data.jobDescription,
      applicationDate: data.applicationDate,
      status: data.status,
      notes: data.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), applicationData)
    const applicationId = docRef.id

    // Upload files if provided
    const updateData: any = {}

    if (data.cvFile) {
      const { url, fileName } = await uploadFile(data.cvFile, userId, applicationId, "cv")
      updateData.cvFileUrl = url
      updateData.cvFileName = fileName
    }

    if (data.coverLetterFile) {
      const { url, fileName } = await uploadFile(data.coverLetterFile, userId, applicationId, "coverLetter")
      updateData.coverLetterFileUrl = url
      updateData.coverLetterFileName = fileName
    }

    // Update document with file URLs if files were uploaded
    if (Object.keys(updateData).length > 0) {
      await updateDoc(docRef, updateData)
    }

    return applicationId
  } catch (error) {
    console.error("Error creating job application:", error)
    throw error
  }
}

// Get all job applications for a user
export const getUserJobApplications = async (userId: string): Promise<JobApplication[]> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not initialized")
    }

    // Temporary fix: Query without orderBy to avoid index requirement
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const applications: JobApplication[] = []

    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...convertJobApplicationData(doc.data()),
      })
    })

    // Sort in memory instead of in the query
    return applications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error getting job applications:", error)
    throw error
  }
}

// Get a single job application
export const getJobApplication = async (applicationId: string): Promise<JobApplication | null> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not initialized")
    }

    const docRef = doc(db, COLLECTION_NAME, applicationId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertJobApplicationData(docSnap.data()),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting job application:", error)
    throw error
  }
}

// Update a job application
export const updateJobApplication = async (data: UpdateJobApplicationData): Promise<void> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not initialized")
    }

    const docRef = doc(db, COLLECTION_NAME, data.id)
    const currentDoc = await getDoc(docRef)

    if (!currentDoc.exists()) {
      throw new Error("Job application not found")
    }

    const currentData = currentDoc.data()
    const updateData: any = {
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      jobDescription: data.jobDescription,
      applicationDate: data.applicationDate,
      status: data.status,
      notes: data.notes,
      updatedAt: new Date(),
    }

    // Handle file uploads
    if (data.cvFile) {
      // Delete old CV file if exists
      if (currentData.cvFileUrl) {
        await deleteFile(currentData.cvFileUrl)
      }

      const { url, fileName } = await uploadFile(data.cvFile, currentData.userId, data.id, "cv")
      updateData.cvFileUrl = url
      updateData.cvFileName = fileName
    }

    if (data.coverLetterFile) {
      // Delete old cover letter file if exists
      if (currentData.coverLetterFileUrl) {
        await deleteFile(currentData.coverLetterFileUrl)
      }

      const { url, fileName } = await uploadFile(data.coverLetterFile, currentData.userId, data.id, "coverLetter")
      updateData.coverLetterFileUrl = url
      updateData.coverLetterFileName = fileName
    }

    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error("Error updating job application:", error)
    throw error
  }
}

// Delete a job application
export const deleteJobApplication = async (applicationId: string): Promise<void> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not initialized")
    }

    const docRef = doc(db, COLLECTION_NAME, applicationId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      // Delete associated files
      if (data.cvFileUrl) {
        await deleteFile(data.cvFileUrl)
      }

      if (data.coverLetterFileUrl) {
        await deleteFile(data.coverLetterFileUrl)
      }
    }

    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting job application:", error)
    throw error
  }
}

// Get application statistics
export const getApplicationStats = async (userId: string) => {
  try {
    const applications = await getUserJobApplications(userId)

    const totalApplications = applications.length
    const statusCounts = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const successfulApplications = statusCounts.offer_received || 0
    const successRate = totalApplications > 0 ? (successfulApplications / totalApplications) * 100 : 0

    return {
      totalApplications,
      statusCounts,
      successRate: Math.round(successRate * 100) / 100,
      recentApplications: applications.slice(0, 5),
    }
  } catch (error) {
    console.error("Error getting application stats:", error)
    throw error
  }
}
