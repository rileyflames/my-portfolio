// About Me management page
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'
import ImageUpload from '../../components/ImageUpload'

/**
 * AboutMe interface
 */
interface AboutMe {
  id: string
  fullName: string
  dob: string
  startedCoding: string
  bio: string
  imageUrl?: string
  technologies: Array<{ id: string; name: string }>
  social: Array<{ id: string; name: string; link: string }>
}

/**
 * Form data interface
 */
interface AboutMeFormData {
  fullName: string
  dob: string
  startedCoding: string
  bio: string
  imageUrl?: string
}

/**
 * AboutMeManager Component
 * - View/Edit About Me information
 * - Single record (singleton pattern)
 */
const AboutMeManager = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AboutMeFormData>()

  const imageUrl = watch('imageUrl')

  /**
   * Fetch About Me data
   */
  const fetchAboutMe = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetAboutMe {
          aboutMe {
            id
            fullName
            dob
            startedCoding
            bio
            imageUrl
            technologies {
              id
              name
            }
            social {
              id
              name
              link
            }
          }
        }
      `)

      if (result.aboutMe) {
        setAboutMe(result.aboutMe)
        reset({
          fullName: result.aboutMe.fullName,
          dob: result.aboutMe.dob,
          startedCoding: result.aboutMe.startedCoding,
          bio: result.aboutMe.bio,
          imageUrl: result.aboutMe.imageUrl || ''
        })
      } else {
        // No About Me record exists yet, show create form
        setIsEditing(true)
      }
    } catch (error: any) {
      console.error('Error fetching about me:', error)
      // If no record exists, that's okay - show create form
      if (error.message?.includes('not found')) {
        setIsEditing(true)
      } else {
        toast.error('Failed to load about me data')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAboutMe()
  }, [])

  /**
   * Handle form submission
   */
  const onSubmit = async (data: AboutMeFormData) => {
    setIsSubmitting(true)

    try {
      // Prepare input data
      const inputData = {
        fullName: data.fullName,
        dob: data.dob,
        startedCoding: data.startedCoding,
        bio: data.bio,
        imageUrl: data.imageUrl || null
      }

      if (aboutMe) {
        // Update existing - AboutMe is a singleton, no ID needed
        await graphqlMutation(
          `
            mutation UpdateAboutMe($input: UpdateAboutMeInput!) {
              updateAboutMe(input: $input) {
                id
                fullName
                dob
                startedCoding
                bio
                imageUrl
              }
            }
          `,
          { input: inputData }
        )
        toast.success('About Me updated successfully!')
      } else {
        // Create new - First time setup
        await graphqlMutation(
          `
            mutation CreateAboutMe($input: CreateAboutMeInput!) {
              createAboutMe(input: $input) {
                id
                fullName
                dob
                startedCoding
                bio
                imageUrl
              }
            }
          `,
          { input: inputData }
        )
        toast.success('About Me created successfully!')
      }

      setIsEditing(false)
      fetchAboutMe()
    } catch (error: any) {
      console.error('Error saving about me:', error)
      toast.error(error.message || 'Failed to save about me')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">About Me</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
        </div>
        {aboutMe && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* View Mode */}
      {aboutMe && !isEditing ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 space-y-4">
          {aboutMe.imageUrl && (
            <img
              src={aboutMe.imageUrl}
              alt={aboutMe.fullName}
              className="w-32 h-32 rounded-full object-cover border-2 border-purple-400 dark:border-purple-500"
            />
          )}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
            <p className="text-lg text-gray-900 dark:text-gray-100">{aboutMe.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</label>
            <p className="text-lg text-gray-900 dark:text-gray-100">{aboutMe.dob}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Started Coding</label>
            <p className="text-lg text-gray-900 dark:text-gray-100">{aboutMe.startedCoding}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Bio</label>
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{aboutMe.bio}</p>
          </div>
        </div>
      ) : (
        /* Edit/Create Form */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                {...register('dob', { required: 'Date of birth is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Started Coding *
              </label>
              <input
                type="date"
                {...register('startedCoding', { required: 'Started coding date is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.startedCoding ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.startedCoding && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.startedCoding.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Image
              </label>
              
              {/* Show current image if exists */}
              {imageUrl && (
                <div className="mb-4">
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-purple-400 dark:border-purple-500"
                  />
                </div>
              )}

              {/* Image Upload Component */}
              <ImageUpload
                onImagesUploaded={(urls) => {
                  if (urls.length > 0) {
                    setValue('imageUrl', urls[0])
                    toast.success('Profile image uploaded!')
                  }
                }}
                maxFiles={1}
                acceptedFileTypes={{
                  'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                }}
              />

              {/* Manual URL input as fallback */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Or enter image URL manually
                </label>
                <input
                  type="url"
                  {...register('imageUrl')}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio *
              </label>
              <textarea
                rows={6}
                {...register('bio', { required: 'Bio is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                  isSubmitting ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600'
                }`}
              >
                {isSubmitting ? 'Saving...' : aboutMe ? 'Update' : 'Create'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    reset()
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AboutMeManager