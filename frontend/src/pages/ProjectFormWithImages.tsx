// Enhanced Project Form with Image Management
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'
import { useAuth } from '../contexts/AuthContext'

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
 * - Upload up to 10 project images via backend REST API
 * - Images stored in backend database and Cloudinary
 * - Remove individual images (deletes from both backend and Cloudinary)
 * - Images are optional
 */
const ProjectFormWithImages = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Get project ID from URL if editing
  const { user } = useAuth() // Get logged-in user
  const isEditMode = !!id // Check if we're editing or creating

  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [projectImages, setProjectImages] = useState<Array<{ id: string; url: string }>>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [contributors, setContributors] = useState<Array<{ id: string; name: string }>>([])
  const [selectedContributors, setSelectedContributors] = useState<string[]>([])

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ProjectFormData>()

  /**
   * Fetch contributors list
   */
  const fetchContributors = async () => {
    try {
      const result = await graphqlQuery(`
        query GetContributors {
          contributors {
            id
            name
          }
        }
      `)
      setContributors(result.contributors || [])
    } catch (error) {
      console.error('Error fetching contributors:', error)
    }
  }

  /**
   * Fetch project data if editing
   * Loads existing project information including images
   */
  useEffect(() => {
    fetchContributors()
    if (isEditMode && id) {
      fetchProject(id)
    }
  }, [id, isEditMode])

  /**
   * Fetch single project for editing
   * Retrieves project data from backend including images
   */
  const fetchProject = async (projectId: string) => {
    try {
      // Fetch project data
      const projectResult = await graphqlQuery(
        `
          query GetProject($id: String!) {
            project(id: $id) {
              id
              name
              githubLink
              liveUrl
              progress
              description
              tags
              contributors {
                id
                name
              }
            }
          }
        `,
        { id: projectId }
      )
      
      const project = projectResult.project
      
      // Populate form with existing data
      setValue('name', project.name)
      setValue('githubLink', project.githubLink)
      setValue('liveUrl', project.liveUrl || '')
      setValue('progress', project.progress)
      setValue('description', project.description)
      setValue('tags', project.tags?.join(', ') || '')
      
      // Set selected contributors
      if (project.contributors) {
        setSelectedContributors(project.contributors.map((c: any) => c.id))
      }
      
      // Fetch project images from backend
      const imagesResult = await graphqlQuery(
        `
          query GetProjectImages($projectId: String!) {
            projectImages(projectId: $projectId) {
              id
              url
            }
          }
        `,
        { projectId }
      )
      
      // Set project images
      if (imagesResult.projectImages) {
        setProjectImages(imagesResult.projectImages)
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
   * Upload images to backend
   */
  const handleImageUpload = async (files: File[]) => {
    if (!id) {
      toast.error('Please save the project first before uploading images')
      return
    }

    if (projectImages.length + files.length > 10) {
      toast.error(`Cannot upload ${files.length} images. Maximum is 10 total.`)
      return
    }

    setIsUploadingImages(true)
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      // Refresh images from backend
      await fetchProjectImages()
      toast.success(`${files.length} image(s) uploaded successfully!`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setIsUploadingImages(false)
    }
  }

  /**
   * Delete image from backend and Cloudinary
   */
  const handleImageRemove = async (imageId: string) => {
    if (!id) return

    if (!confirm('Delete this image? It will be removed from Cloudinary as well.')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}/images/${imageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Refresh images from backend
      await fetchProjectImages()
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete image')
    }
  }

  /**
   * Fetch project images from backend
   */
  const fetchProjectImages = async () => {
    if (!id) return

    try {
      const result = await graphqlQuery(
        `
          query GetProjectImages($projectId: String!) {
            projectImages(projectId: $projectId) {
              id
              url
            }
          }
        `,
        { projectId: id }
      )

      if (result.projectImages) {
        setProjectImages(result.projectImages)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
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
        description: data.description,
        tags: tagsArray.length > 0 ? tagsArray : [],
        technologyIds: [],
        contributorIds: selectedContributors.length > 0 ? selectedContributors : [],
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
        navigate('/admin/projects')
      } else {
        // Create new project
        const createInput = {
          ...baseInput,
          createdById: user?.id
        }
        
        const result = await graphqlMutation(
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
        
        toast.success('Project created successfully! You can now add images.')
        // Navigate to edit mode so user can add images
        navigate(`/admin/projects/edit/${result.createProject.id}`)
      }
      
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 flex items-center transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEditMode ? 'Update project information and images' : 'Add a new project to your portfolio with images'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Project name is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="My Awesome Project"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* GitHub Link */}
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.githubLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://github.com/username/repo"
              />
              {errors.githubLink && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.githubLink.message}</p>
              )}
            </div>

            {/* Live URL */}
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.liveUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://myproject.com"
              />
              {errors.liveUrl && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.liveUrl.message}</p>
              )}
            </div>

            {/* Progress Status */}
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Status *
              </label>
              <select
                id="progress"
                {...register('progress', { required: 'Status is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.progress ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="finished">Finished</option>
              </select>
              {errors.progress && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.progress.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe your project, its features, and what you learned..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                {...register('tags')}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="web, mobile, api (comma-separated)"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter tags separated by commas
              </p>
            </div>

            {/* Contributors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contributors (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('adminActiveTab', 'contributors')
                    navigate('/admin/projects')
                  }}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  + Add New Contributor
                </button>
              </div>
              
              {contributors.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  No contributors available.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('adminActiveTab', 'contributors')
                      navigate('/admin/projects')
                    }}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Add one now
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {contributors.map((contributor) => (
                    <label
                      key={contributor.id}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContributors.includes(contributor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContributors([...selectedContributors, contributor.id])
                          } else {
                            setSelectedContributors(selectedContributors.filter(id => id !== contributor.id))
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                        {contributor.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              
              {selectedContributors.length > 0 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedContributors.length} contributor(s) selected
                </p>
              )}
            </div>

            {/* Project Images Section - Only show in edit mode */}
            {isEditMode && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Project Images ({projectImages.length}/10)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Upload up to 10 images to showcase your project. Images are optional.
                  </p>
                </div>

                {/* Image Upload Area */}
                {projectImages.length < 10 && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        if (files.length > 0) {
                          handleImageUpload(files)
                        }
                      }}
                      disabled={isUploadingImages}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center cursor-pointer ${
                        isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploadingImages ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mb-3"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploading images...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Click to upload images</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WebP up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {/* Image Gallery */}
                {projectImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {projectImages.map((image) => (
                      <div key={image.id} className="relative group aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={image.url}
                          alt="Project"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(image.id)}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {projectImages.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No images uploaded yet</p>
                  </div>
                )}
              </>
            )}

            {/* Message for new projects */}
            {!isEditMode && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    💡 Save the project first, then you can add images by editing it.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600'
                }`}
              >
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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