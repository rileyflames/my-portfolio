/**
 * Image Manager Component
 * 
 * Features:
 * - Upload images with drag & drop
 * - Display thumbnails in grid
 * - Delete images with confirmation (Facebook style)
 * - Shows alt text
 * - Accessible with keyboard navigation
 */

import { useState, useEffect, useRef } from 'react'
import { Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Image {
  id: string
  url: string
  filename: string
  alt_text?: string
  public_id: string
  created_at: string
}

interface ImageManagerProps {
  projectId?: string
  ownerId?: string
  onImagesChange?: (images: Image[]) => void
}

const ImageManager = ({ projectId, ownerId, onImagesChange }: ImageManagerProps) => {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    fetchImages()
  }, [projectId, ownerId])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (projectId) params.append('projectId', projectId)
      if (ownerId) params.append('ownerId', ownerId)

      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE}/api/images?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      setImages(response.data.data || [])
      onImagesChange?.(response.data.data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or WebP images.')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    await uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (projectId) formData.append('project_id', projectId)
      if (ownerId) formData.append('owner_id', ownerId)

      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE}/api/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const newImage = response.data
      setImages([newImage, ...images])
      onImagesChange?.([newImage, ...images])
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (image: Image) => {
    if (!confirm(`Delete "${image.filename}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE}/api/images/${image.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      const updatedImages = images.filter((img) => img.id !== image.id)
      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      toast.success('Image deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting image:', error)
      toast.error(error.response?.data?.message || 'Failed to delete image')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-600'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          aria-label="Upload image file"
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Click to upload
                </button>
                <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG, PNG, or WebP (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <img
                src={image.url}
                alt={image.alt_text || image.filename}
                className="w-full h-full object-cover"
              />

              {/* Delete Overlay (Facebook style) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 bg-red-600 hover:bg-red-700 rounded-full text-white"
                  aria-label={`Delete ${image.filename}`}
                  title="Delete image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Filename */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs truncate" title={image.filename}>
                  {image.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No images uploaded yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Upload your first image to get started
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageManager
