// Contributors management page
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'

interface Contributor {
  id: string
  name: string
  email: string
  github: string
  projects?: Array<{ id: string; name: string }>
}

interface ContributorFormData {
  name: string
  email: string
  github: string
}

const ContributorsManager = () => {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContributorFormData>()

  const fetchContributors = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetContributors {
          contributors {
            id
            name
            email
            github
            projects {
              id
              name
            }
          }
        }
      `)
      setContributors(result.contributors || [])
    } catch (error) {
      console.error('Error fetching contributors:', error)
      toast.error('Failed to load contributors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContributors()
  }, [])

  const onSubmit = async (data: ContributorFormData) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await graphqlMutation(
          `mutation UpdateContributor($id: String!, $input: UpdateContributorInput!) {
            updateContributor(id: $id, input: $input) { id name email github }
          }`,
          { id: editingId, input: data }
        )
        toast.success('Contributor updated!')
      } else {
        await graphqlMutation(
          `mutation CreateContributor($input: CreateContributorInput!) {
            createContributor(input: $input) { id name email github }
          }`,
          { input: data }
        )
        toast.success('Contributor created!')
      }
      setShowForm(false)
      setEditingId(null)
      reset()
      fetchContributors()
    } catch (error) {
      console.error('Error saving contributor:', error)
      toast.error('Failed to save contributor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (contributor: Contributor) => {
    setEditingId(contributor.id)
    setShowForm(true)
    reset({ name: contributor.name, email: contributor.email, github: contributor.github })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contributor?')) return
    try {
      await graphqlMutation(`mutation DeleteContributor($id: String!) { deleteContributor(id: $id) }`, { id })
      toast.success('Contributor deleted!')
      fetchContributors()
    } catch (error) {
      toast.error('Failed to delete contributor')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contributors</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage project collaborators</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); reset({ name: '', email: '', github: '' }); }}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all"
        >
          + Add Contributor
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 border border-white/20 rounded-lg shadow-md p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{editingId ? 'Edit' : 'Add'} Contributor</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email'
                  }
                })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub Username/URL *</label>
              <input
                type="text"
                {...register('github', { required: 'GitHub profile is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.github ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="johndoe or https://github.com/johndoe"
              />
              {errors.github && <p className="mt-1 text-sm text-red-400">{errors.github.message}</p>}
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'}`}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); reset(); }} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-white rounded-lg hover:bg-white/10 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributors.map((contributor) => (
          <div key={contributor.id} className="bg-white/10 border border-white/20 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow backdrop-blur-sm overflow-hidden">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">{contributor.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{contributor.email}</p>
              <a 
                href={contributor.github.startsWith('http') ? contributor.github : `https://github.com/${contributor.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 hover:underline mt-1 block truncate"
                title={contributor.github}
              >
                {contributor.github}
              </a>
              {contributor.projects && contributor.projects.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Projects: {contributor.projects.length}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contributor.projects.slice(0, 3).map(project => (
                      <span key={project.id} className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded border border-purple-400/30 truncate max-w-full">
                        {project.name}
                      </span>
                    ))}
                    {contributor.projects.length > 3 && (
                      <span className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded border border-purple-400/30">
                        +{contributor.projects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(contributor)} className="flex-1 px-3 py-2 text-sm text-purple-400 border border-purple-400/50 rounded hover:bg-purple-600/20 transition-colors">
                Edit
              </button>
              <button onClick={() => handleDelete(contributor.id)} className="flex-1 px-3 py-2 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-600/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {contributors.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white/10 border border-white/20 rounded-lg shadow-md backdrop-blur-sm">
          <p className="text-gray-600 dark:text-gray-400">No contributors yet. Add your first one!</p>
        </div>
      )}
    </div>
  )
}

export default ContributorsManager

