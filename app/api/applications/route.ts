import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAuth } from '@/lib/firebase'
import { createJobApplication } from '@/lib/firestore'
import type { CreateJobApplicationData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // For now, we'll simulate token verification
    // In a real implementation, you'd verify the Firebase ID token
    const token = authHeader.replace('Bearer ', '')
    
    // TODO: Verify Firebase ID token
    // const auth = getFirebaseAuth()
    // const decodedToken = await auth.verifyIdToken(token)
    // const userId = decodedToken.uid
    
    // For development, we'll use a simulated user ID
    const userId = 'simulated-user-id' // Replace with actual token verification

    // Parse form data
    const formData = await request.formData()
    
    // Extract application data
    const applicationData: CreateJobApplicationData = {
      jobTitle: formData.get('jobTitle') as string,
      companyName: formData.get('companyName') as string,
      jobDescription: formData.get('jobDescription') as string || '',
      applicationDate: new Date(formData.get('applicationDate') as string),
      status: (formData.get('status') as any) || 'applied',
      notes: formData.get('notes') as string || '',
    }

    // Handle file uploads
    const cvFile = formData.get('cvFile') as File | null
    const coverLetterFile = formData.get('coverLetterFile') as File | null

    if (cvFile && cvFile.size > 0) {
      applicationData.cvFile = cvFile
    }
    if (coverLetterFile && coverLetterFile.size > 0) {
      applicationData.coverLetterFile = coverLetterFile
    }

    // Validate required fields
    if (!applicationData.jobTitle || !applicationData.companyName) {
      return NextResponse.json(
        { error: 'Job title and company name are required' },
        { status: 400 }
      )
    }

    // Save application
    const applicationId = await createJobApplication(userId, applicationData)

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Job application saved successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to save job application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'CV Tracker API - Use POST to create applications',
    version: '1.0.0'
  })
}