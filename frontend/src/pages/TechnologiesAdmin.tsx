// Technologies admin page for managing skills
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'

interface Technology {
  id: string
  name: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

interface TechFormData {
  name: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

const TechnologiesAdmin = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TechFormData>()

  const fetchTechnologies = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetTechnologies {
          technologies {
            id
            name
            icon
            level
          }
        }
      `)
      setTechnologies(result.technologies)
    } catch (error) {
      toast.error('Failed to load technologies')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: TechFormData) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await graphqlMutation(
          `mutation UpdateTechnology($id: String!, $input: UpdateTechnologyInput!) {
            updateTechnology(id: $id, input: $input) { id name icon level }
          }`,
          { id: editingId, input: data }
        )
        toast.success('Technology updated!')
      } else {
        await graphqlMutation(
          `mutation CreateTechnology($input: CreateTechnologyInput!) {
            createTechnology(input: $input) { id name icon level }
          }`,
          { input: data }
        )
        toast.success('Technology created!')
      }
      reset()
      setEditingId(null)
      fetchTechnologies()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save technology')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (tech: Technology) => {
    setEditingId(tech.id)
    reset(tech)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this technology?')) return
    try {
      await graphqlMutation(`mutation DeleteTechnology($id: String!) { deleteTechnology(id: $id) }`, { id })
      toast.success('Technology deleted!')
      fetchTechnologies()
    } catch (error) {
      toast.error('Failed to delete technology')
    }
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-green-100 text-green-800'
    }
    return colors[level as keyof typeof colors]
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Technologies</h2>
        <p className="text-gray-600 mt-1">Manage your skills and technologies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Technology' : 'Add Technology'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="React"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL *</label>
                <input
                  {...register('icon', { required: 'Icon is required' })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="https://..."
                />
                {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  {...register('level', { required: 'Level is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); reset(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : technologies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">No technologies yet. Add your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technologies.map((tech) => (
                <div key={tech.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={tech.icon} alt={tech.name} className="w-10 h-10 object-contain" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getLevelBadge(tech.level)}`}>
                          {tech.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tech)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tech.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
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

export default TechnologiesAdmin