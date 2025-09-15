export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = "." + getFileExtension(file.name).toLowerCase()
  return allowedTypes.includes(fileExtension)
}

export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now()
  const extension = getFileExtension(originalName)
  const nameWithoutExtension = originalName.replace(`.${extension}`, "")
  return `${timestamp}_${nameWithoutExtension}.${extension}`
}
