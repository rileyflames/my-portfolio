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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SocialMediaFormData>()

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
          { id: editingId, input: data }
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
    reset(social)
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
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
          <p className="text-gray-600">Manage your social media links</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            reset({ name: '', link: '', icon: '' })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Link
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Social Link</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Twitter, LinkedIn, GitHub..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL *</label>
              <input
                type="url"
                {...register('link', { required: 'Link is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="https://twitter.com/username"
              />
              {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL *</label>
              <input
                type="text"
                {...register('icon', { required: 'Icon is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="twitter-icon or https://example.com/icon.svg"
              />
              {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); reset(); }} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((social) => (
          <div key={social.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">{social.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{social.name}</h3>
                  <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]">
                    {social.link}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(social)} className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Edit
              </button>
              <button onClick={() => handleDelete(social.id)} className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {socialLinks.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No social links yet. Add your first one!</p>
        </div>
      )}
    </div>
  )
}

export default SocialMediaManager