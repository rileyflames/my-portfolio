// Technologies management page
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'

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

const TechnologiesManager = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

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
      setTechnologies(result.technologies || [])
    } catch (error) {
      console.error('Error fetching technologies:', error)
      toast.error('Failed to load technologies')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const onSubmit = async (data: TechFormData) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await graphqlMutation(
          `mutation UpdateTech($id: String!, $input: UpdateTechnologyInput!) {
            updateTechnology(id: $id, input: $input) { id name icon level }
          }`,
          { id: editingId, input: data }
        )
        toast.success('Technology updated!')
      } else {
        await graphqlMutation(
          `mutation CreateTech($input: CreateTechnologyInput!) {
            createTechnology(input: $input) { id name icon level }
          }`,
          { input: data }
        )
        toast.success('Technology created!')
      }
      setShowForm(false)
      setEditingId(null)
      reset()
      fetchTechnologies()
    } catch (error) {
      console.error('Error saving technology:', error)
      toast.error('Failed to save technology')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (tech: Technology) => {
    setEditingId(tech.id)
    setShowForm(true)
    reset(tech)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this technology?')) return
    try {
      await graphqlMutation(`mutation DeleteTech($id: String!) { deleteTechnology(id: $id) }`, { id })
      toast.success('Technology deleted!')
      fetchTechnologies()
    } catch (error) {
      toast.error('Failed to delete technology')
    }
  }

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-green-100 text-green-800'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technologies</h2>
          <p className="text-gray-600">Manage your skills and technologies</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); reset({ name: '', icon: '', level: 'beginner' }); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Technology
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Technology</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technology Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="React, Node.js, Python..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL *</label>
              <input
                type="text"
                {...register('icon', { required: 'Icon is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="react-icon or https://example.com/icon.svg"
              />
              {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level *</label>
              <select
                {...register('level', { required: 'Level is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${errors.level ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>}
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
        {technologies.map((tech) => (
          <div key={tech.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{tech.name}</h3>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(tech.level)}`}>
                  {tech.level}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(tech)} className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Edit
              </button>
              <button onClick={() => handleDelete(tech.id)} className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {technologies.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No technologies yet. Add your first one!</p>
        </div>
      )}
    </div>
  )
}

export default TechnologiesManager