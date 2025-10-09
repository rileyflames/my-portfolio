// Social Media admin page for managing social links
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'

interface SocialMedia {
  id: string
  name: string
  url: string
  icon?: string
}

interface SocialFormData {
  name: string
  url: string
  icon?: string
}

const SocialMediaAdmin = () => {
  const [items, setItems] = useState<SocialMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SocialFormData>()

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const res = await graphqlQuery(`
        query GetSocials { socialMedia { id name url icon } }
      `)
      setItems(res.socialMedia || [])
    } catch (err) {
      toast.error('Failed to load social links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const onSubmit = async (data: SocialFormData) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await graphqlMutation(`mutation UpdateSocial($id: String!, $input: UpdateSocialInput!) { updateSocial(id: $id, input: $input) { id name url icon } }`, { id: editingId, input: data })
        toast.success('Social link updated')
      } else {
        await graphqlMutation(`mutation CreateSocial($input: CreateSocialInput!) { createSocial(input: $input) { id name url icon } }`, { input: data })
        toast.success('Social link created')
      }
      reset()
      setEditingId(null)
      fetchItems()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: SocialMedia) => {
    setEditingId(item.id)
    reset({ name: item.name, url: item.url, icon: item.icon })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      await graphqlMutation(`mutation DeleteSocial($id: String!) { deleteSocial(id: $id) }`, { id })
      toast.success('Deleted')
      fetchItems()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
        <p className="text-gray-600 mt-1">Manage social links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Link' : 'Add Link'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input {...register('name', { required: 'Name is required' })} className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Twitter" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                <input {...register('url', { required: 'URL is required' })} className={`w-full px-4 py-2 border rounded-lg ${errors.url ? 'border-red-500' : 'border-gray-300'}`} placeholder="https://..." />
                {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (optional)</label>
                <input {...register('icon')} className="w-full px-4 py-2 border rounded-lg border-gray-300" placeholder="https://..." />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                {editingId && (<button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>)}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center"><p className="text-gray-600">No social links yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((it) => (
                <div key={it.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {it.icon ? <img src={it.icon} alt={it.name} className="w-10 h-10 object-contain" /> : <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">{it.name.charAt(0)}</div>}
                      <div>
                        <h4 className="font-semibold text-gray-900">{it.name}</h4>
                        <a href={it.url} className="text-sm text-blue-600" target="_blank" rel="noreferrer">{it.url}</a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(it)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => handleDelete(it.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialMediaAdmin