// Social Media management page
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'

interface SocialMedia {
  id: string
  name: string
  link: string
  icon: string
}

interface SocialMediaFormData {
  name: string
  link: string
  icon: string
}

const SocialMediaManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SocialMediaFormData>()

  const iconValue = watch('icon')

  // Update preview when icon value changes
  useEffect(() => {
    if (iconValue) {
      setIconPreview(iconValue)
    }
  }, [iconValue])

  const fetchSocialLinks = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetSocialLinks {
          mySocialMediaLinks {
            id
            name
            link
            icon
          }
        }
      `)
      setSocialLinks(result.mySocialMediaLinks || [])
    } catch (error) {
      console.error('Error fetching social links:', error)
      toast.error('Failed to load social links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const onSubmit = async (data: SocialMediaFormData) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        // Only send name, link, and icon (not id) in the input
        const updateInput = {
          name: data.name,
          link: data.link,
          icon: data.icon
        }
        await graphqlMutation(
          `
            mutation UpdateSocialLink($id: String!, $input: UpdateSocialMediaInput!) {
              updateSocialMediaLink(id: $id, input: $input) {
                id
                name
                link
                icon
              }
            }
          `,
          { id: editingId, input: updateInput }
        )
        toast.success('Social link updated!')
      } else {
        await graphqlMutation(
          `
            mutation CreateSocialLink($input: CreateSocialMediaInput!) {
              createSocialMediaLink(input: $input) {
                id
                name
                link
                icon
              }
            }
          `,
          { input: data }
        )
        toast.success('Social link created!')
      }
      setShowForm(false)
      setEditingId(null)
      reset()
      fetchSocialLinks()
    } catch (error) {
      console.error('Error saving social link:', error)
      toast.error('Failed to save social link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (social: SocialMedia) => {
    setEditingId(social.id)
    setShowForm(true)
    setIconPreview(social.icon)
    // Only reset with the form fields (exclude id)
    reset({
      name: social.name,
      link: social.link,
      icon: social.icon
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      await graphqlMutation(
        `mutation DeleteSocialLink($id: String!) { deleteSocialMediaLink(id: $id) }`,
        { id }
      )
      toast.success('Social link deleted!')
      fetchSocialLinks()
    } catch (error) {
      toast.error('Failed to delete social link')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Social Media</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your social media links</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setIconPreview('')
            reset({ name: '', link: '', icon: '' })
          }}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all"
        >
          + Add Link
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{editingId ? 'Edit' : 'Add'} Social Link</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Twitter, LinkedIn, GitHub..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile URL *</label>
              <input
                type="url"
                {...register('link', { required: 'Link is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.link ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="https://twitter.com/username"
              />
              {errors.link && <p className="mt-1 text-sm text-red-400">{errors.link.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon *</label>
              
              {/* Icon Preview */}
              {(iconPreview || iconValue) && (
                <div className="mb-3 p-4 border border-white/20 rounded-lg bg-white/5 flex items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    {(iconPreview || iconValue).startsWith('http') ? (
                      <img src={iconPreview || iconValue} alt="Icon preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-4xl">{iconPreview || iconValue}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Icon URL/Emoji Input */}
              <div>
                <input
                  type="text"
                  {...register('icon', { required: 'Icon is required' })}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.icon ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="🐦 or https://img.icons8.com/?size=100&id=..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  💡 Tip: Use emojis (🐦) or paste icon URLs from{' '}
                  <a href="https://icons8.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Icons8
                  </a>
                  {', '}
                  <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    SimpleIcons
                  </a>
                  {', or '}
                  <a href="https://devicon.dev" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Devicon
                  </a>
                </p>
              </div>
              {errors.icon && <p className="mt-1 text-sm text-red-400">{errors.icon.message}</p>}
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'}`}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setIconPreview(''); reset(); }} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-white rounded-lg hover:bg-white/10 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((social) => (
          <div key={social.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  {social.icon.startsWith('http') ? (
                    <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-3xl">{social.icon}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{social.name}</h3>
                  <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 hover:underline truncate block" title={social.link}>
                    {social.link}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(social)} className="flex-1 px-3 py-2 text-sm text-purple-400 border border-purple-400/50 rounded hover:bg-purple-600/20 transition-colors">
                Edit
              </button>
              <button onClick={() => handleDelete(social.id)} className="flex-1 px-3 py-2 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-600/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {socialLinks.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">No social links yet. Add your first one!</p>
        </div>
      )}
    </div>
  )
}

export default SocialMediaManager
