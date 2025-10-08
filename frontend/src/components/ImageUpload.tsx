// Image Upload Component with drag-and-drop support
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Props for ImageUpload component
 */
interface ImageUploadProps {
  /**
   * Maximum number of images allowed
   * @default 1
   */
  maxImages?: number
  
  /**
   * Current images (URLs)
   */
  images: string[]
  
  /**
   * Callback when images are uploaded
   * @param urls - Array of uploaded image URLs
   */
  onImagesUploaded: (urls: string[]) => void
  
  /**
   * Callback when an image is removed
   * @param url - URL of the image to remove
   */
  onImageRemove: (url: string) => void
  
  /**
   * Accepted file types
   * @default 'image/*'
   */
  accept?: string
  
  /**
   * Label for the upload area
   */
  label?: string
  
  /**
   * Whether to show preview of uploaded images
   * @default true
   */
  showPreview?: boolean
}

/**
 * ImageUpload Component
 * - Drag and drop file upload
 * - Traditional file picker
 * - Image preview
 * - Multiple image support
 * - File type validation
 * - Size validation
 * 
 * @example
 * ```tsx
 * <ImageUpload
 *   maxImages={10}
 *   images={projectImages}
 *   onImagesUploaded={(urls) => setProjectImages([...projectImages, ...urls])}
 *   onImageRemove={(url) => setProjectImages(projectImages.filter(img => img !== url))}
 *   label="Project Images"
 * />
 * ```
 */
const ImageUpload = ({
  maxImages = 1,
  images = [],
  onImagesUploaded,
  onImageRemove,
  accept = 'image/*',
  label = 'Upload Images',
  showPreview = true
}: ImageUploadProps) => {
  // State for upload progress
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  /**
   * Handle file drop or selection
   * Validates files and uploads them
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if we've reached the maximum number of images
    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} image(s) allowed`)
      return
    }

    // Limit files to remaining slots
    const filesToUpload = acceptedFiles.slice(0, remainingSlots)
    
    if (filesToUpload.length < acceptedFiles.length) {
      toast.error(`Only ${remainingSlots} more image(s) can be uploaded`)
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedUrls: string[] = []

      // Upload each file
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`)
          continue
        }

        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'your_upload_preset') // Replace with your Cloudinary preset
        
        // Upload to Cloudinary
        // Note: In production, you should upload through your backend for security
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
          {
            method: 'POST',
            body: formData
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const data = await response.json()
        uploadedUrls.push(data.secure_url)

        // Update progress
        setUploadProgress(((i + 1) / filesToUpload.length) * 100)
      }

      // Call the callback with uploaded URLs
      if (uploadedUrls.length > 0) {
        onImagesUploaded(uploadedUrls)
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [images.length, maxImages, onImagesUploaded])

  /**
   * Configure react-dropzone
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept === 'image/svg+xml' ? { 'image/svg+xml': ['.svg'] } : { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: maxImages - images.length,
    disabled: isUploading || images.length >= maxImages
  })

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {maxImages > 1 && `(${images.length}/${maxImages})`}
        </label>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                {isDragActive ? (
                  <p className="text-sm text-blue-600 font-medium">Drop the files here...</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Drag and drop {accept === 'image/svg+xml' ? 'SVG' : 'images'} here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      {accept === 'image/svg+xml' ? 'SVG files only' : 'PNG, JPG, GIF, WebP'} • Max 5MB per file
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {showPreview && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                onClick={() => onImageRemove(imageUrl)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Number Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {showPreview && images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}

export default ImageUpload