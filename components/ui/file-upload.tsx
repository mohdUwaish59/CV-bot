"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  description?: string
  className?: string
  disabled?: boolean
  currentFile?: File | null
  currentFileName?: string
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
  label = "Upload file",
  description = "PDF, DOC, or DOCX files only",
  className,
  disabled = false,
  currentFile,
  currentFileName,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const intervalRef = useRef<number | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    const allowedTypes = accept.split(",").map((type) => type.trim().toLowerCase())
    const fileExtension = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")
    if (!allowedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload ${allowedTypes.join(", ")} files only.`
    }
    return null
  }

  const startSimulatedUpload = useCallback(() => {
    // clear any previous timer
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setUploadStatus("uploading")
    setUploadProgress(0)

    intervalRef.current = window.setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setUploadStatus("success") // ✅ end of upload; parent will be notified in useEffect
          return 100
        }
        return prev + 10
      })
    }, 100)
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file)
      if (error) {
        setErrorMessage(error)
        setUploadStatus("error")
        return
      }

      setErrorMessage("")
      setSelectedFile(file)
      startSimulatedUpload()
    },
    [startSimulatedUpload],
  )

  // ✅ Notify parent AFTER render when upload succeeds
  useEffect(() => {
    if (uploadStatus === "success" && selectedFile) {
      onFileSelect(selectedFile)
    }
  }, [uploadStatus, selectedFile, onFileSelect])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (disabled) return
      const files = e.dataTransfer.files
      if (files && files[0]) handleFileSelect(files[0])
    },
    [handleFileSelect, disabled],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const files = e.target.files
    if (files && files[0]) handleFileSelect(files[0])
  }

  const handleRemoveFile = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    setSelectedFile(null)
    onFileSelect(null) // event handler; safe to call directly
  }

  const displayFile = currentFile ?? selectedFile
  const displayFileName = currentFileName || displayFile?.name

  return (
    <div className={cn("space-y-2", className)}>
      {displayFile || uploadStatus === "success" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {uploadStatus === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <FileText className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{displayFileName}</p>
                {displayFile && (
                  <p className="text-xs text-muted-foreground">
                    {(displayFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} disabled={disabled}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-muted-foreground/50 cursor-pointer",
            uploadStatus === "error" && "border-destructive bg-destructive/5",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="space-y-2">
            {uploadStatus === "error" ? (
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            ) : (
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium">
                {uploadStatus === "error" ? "Upload failed" : `Click to upload ${label.toLowerCase()}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadStatus === "error" ? errorMessage : `${description} (max ${maxSize}MB)`}
              </p>
            </div>

            {uploadStatus === "error" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadStatus("idle")
                  setErrorMessage("")
                }}
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
