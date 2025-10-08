// Enhanced Project Form with Image Management
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'
import { useAuth } from '../contexts/AuthContext'
import ImageUpload from '../components/ImageUpload'
import SortableImageGallery from '../components/SortableImageGallery'

/**
 * Project form data interface
 */
interface ProjectFormData {
  name: string
  githubLink: string
  liveUrl?: string
  progress: 'pending' | 'in-progress' | 'finished'
  description: string
  tags?: string
}

/**
 * ProjectFormWithImages Component
 * - Create/Edit projects
 * - Upload up to 10 project images
 * - Drag and drop image upload
 * - Reorder images by dragging
 * - Remove individual images
 * - View images in full size
 * - All with beginner-friendly comments
 */
const ProjectFormWithImages = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Get project ID from URL if editing
  const { user } = useAuth() // Get logged-in user
  const isEditMode = !!id // Check if we're editing or creating

  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [projectImages, setProjectImages] = useState<string[]>([]) // Array of image URLs

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ProjectFormData>()

  /**
   * Fetch project data if editing
   * Loads existing project information including images
   */
  useEffect(() => {
    if (isEditMode && id) {
      fetchProject(id)
    }
  }, [id, isEditMode])

  /**
   * Fetch single project for editing
   * Retrieves project data from backend
   */
  const fetchProject = async (projectId: string) => {
    try {
      const result = await graphqlQuery(
        `
          query GetProject($id: String!) {
            project(id: $id) {
              id
              name
              githubLink
              liveUrl
              progress
              imageUrl
              description
              tags
            }
          }
        `,
        { id: projectId }
      )
      
      const project = result.project
      
      // Populate form with existing data
      setValue('name', project.name)
      setValue('githubLink', project.githubLink)
      setValue('liveUrl', project.liveUrl || '')
      setValue('progress', project.progress)
      setValue('description', project.description)
      setValue('tags', project.tags?.join(', ') || '')
      
      // Load existing images
      // Note: Backend currently stores single imageUrl, we'll need to update it to store array
      if (project.imageUrl) {
        setProjectImages([project.imageUrl])
      }
      
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
      navigate('/admin/projects')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle new images uploaded
   * Adds newly uploaded images to the project images array
   * 
   * @param urls - Array of uploaded image URLs from Cloudinary
   */
  const handleImagesUploaded = (urls: string[]) => {
    setProjectImages([...projectImages, ...urls])
  }

  /**
   * Handle image removal
   * Removes an image from the project images array
   * 
   * @param url - URL of the image to remove
   */
  const handleImageRemove = (url: string) => {
    setProjectImages(projectImages.filter(img => img !== url))
  }

  /**
   * Handle image reordering
   * Updates the order of images when user drags and drops
   * 
   * @param newOrder - New array of image URLs in desired order
   */
  const handleImageReorder = (newOrder: string[]) => {
    setProjectImages(newOrder)
  }

  /**
   * Handle form submission
   * Creates or updates project with all data including images
   */
  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)

    try {
      // Convert tags string to array
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

      // Prepare base input data (common fields)
      const baseInput = {
        name: data.name,
        githubLink: data.githubLink,
        liveUrl: data.liveUrl || null,
        progress: data.progress,
        // For now, use first image as main imageUrl
        // TODO: Update backend to support multiple images array
        imageUrl: projectImages.length > 0 ? projectImages[0] : null,
        description: data.description,
        tags: tagsArray.length > 0 ? tagsArray : null,
        technologyIds: null, // Can be added later
      }

      if (isEditMode) {
        // Update existing project
        const updateInput = {
          ...baseInput,
          editedById: user?.id
        }
        
        await graphqlMutation(
          `
            mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {
              updateProject(id: $id, input: $input) {
                id
                name
              }
            }
          `,
          { id, input: updateInput }
        )
        
        toast.success('Project updated successfully!')
      } else {
        // Create new project
        const createInput = {
          ...baseInput,
          createdById: user?.id
        }
        
        await graphqlMutation(
          `
            mutation CreateProject($input: CreateProjectInput!) {
              createProject(input: $input) {
                id
                name
              }
            }
          `,
          { input: createInput }
        )
        
        toast.success('Project created successfully!')
      }
      
      navigate('/admin/projects')
      
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while fetching project data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Update project information and images' : 'Add a new project to your portfolio with images'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Project name is required' })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="My Awesome Project"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* GitHub Link */}
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL *
              </label>
              <input
                type="url"
                id="githubLink"
                {...register('githubLink', { 
                  required: 'GitHub link is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.githubLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://github.com/username/repo"
              />
              {errors.githubLink && (
                <p className="mt-1 text-sm text-red-600">{errors.githubLink.message}</p>
              )}
            </div>

            {/* Live URL */}
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                id="liveUrl"
                {...register('liveUrl', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.liveUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://myproject.com"
              />
              {errors.liveUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.liveUrl.message}</p>
              )}
            </div>

            {/* Progress Status */}
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                Project Status *
              </label>
              <select
                id="progress"
                {...register('progress', { required: 'Status is required' })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.progress ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="finished">Finished</option>
              </select>
              {errors.progress && (
                <p className="mt-1 text-sm text-red-600">{errors.progress.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your project, its features, and what you learned..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                {...register('tags')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="web, mobile, api (comma-separated)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter tags separated by commas
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Images
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload up to 10 images to showcase your project. Drag and drop to reorder them.
              </p>
            </div>

            {/* Image Upload */}
            <ImageUpload
              maxImages={10}
              images={projectImages}
              onImagesUploaded={handleImagesUploaded}
              onImageRemove={handleImageRemove}
              label="Upload Project Images"
              showPreview={false}
            />

            {/* Sortable Image Gallery */}
            {projectImages.length > 0 && (
              <SortableImageGallery
                images={projectImages}
                onReorder={handleImageReorder}
                onRemove={handleImageRemove}
                label="Project Gallery"
              />
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectFormWithImages