// About Me management page
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'

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
    reset
  } = useForm<AboutMeFormData>()

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {aboutMe && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      {/* View Mode */}
      {aboutMe && !isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {aboutMe.imageUrl && (
            <img
              src={aboutMe.imageUrl}
              alt={aboutMe.fullName}
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-lg text-gray-900">{aboutMe.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
            <p className="text-lg text-gray-900">{aboutMe.dob}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Started Coding</label>
            <p className="text-lg text-gray-900">{aboutMe.startedCoding}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Bio</label>
            <p className="text-gray-900 whitespace-pre-wrap">{aboutMe.bio}</p>
          </div>
        </div>
      ) : (
        /* Edit/Create Form */
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                {...register('dob', { required: 'Date of birth is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Started Coding *
              </label>
              <input
                type="date"
                {...register('startedCoding', { required: 'Started coding date is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.startedCoding ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startedCoding && (
                <p className="mt-1 text-sm text-red-600">{errors.startedCoding.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                {...register('imageUrl')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                rows={6}
                {...register('bio', { required: 'Bio is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
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
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
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