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
  category: 'language' | 'framework' | 'devops'
}

interface TechFormData {
  name: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: 'language' | 'framework' | 'devops'
}

const TechnologiesManager = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TechFormData>()
  
  const iconValue = watch('icon')

  // Update preview when icon value changes
  useEffect(() => {
    if (iconValue) {
      setIconPreview(iconValue)
    }
  }, [iconValue])

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
            category
          }
        }
      `)
      // Convert level and category to lowercase for display
      const techs = (result.technologies || []).map((tech: any) => ({
        ...tech,
        level: tech.level.toLowerCase(),
        category: tech.category.toLowerCase()
      }))
      setTechnologies(techs)
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
      // Convert level and category to uppercase for backend enum
      const input = {
        ...data,
        level: data.level.toUpperCase(),
        category: data.category.toUpperCase()
      }

      if (editingId) {
        await graphqlMutation(
          `mutation UpdateTech($id: String!, $input: UpdateTechnologyInput!) {
            updateTechnology(id: $id, input: $input) { id name icon level category }
          }`,
          { id: editingId, input }
        )
        toast.success('Technology updated!')
      } else {
        await graphqlMutation(
          `mutation CreateTech($input: CreateTechnologyInput!) {
            createTechnology(input: $input) { id name icon level category }
          }`,
          { input }
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
    setIconPreview(tech.icon)
    // Only reset with form fields, exclude id
    reset({
      name: tech.name,
      icon: tech.icon,
      level: tech.level,
      category: tech.category
    })
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

  const getCategoryColor = (category: string) => {
    const colors = {
      language: 'bg-purple-100 text-purple-800',
      framework: 'bg-cyan-100 text-cyan-800',
      devops: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Technologies</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your skills and technologies</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setIconPreview(''); reset({ name: '', icon: '', level: 'beginner', category: 'language' }); }}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all"
        >
          + Add Technology
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{editingId ? 'Edit' : 'Add'} Technology</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technology Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="React, Node.js, Python..."
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
              
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
                  placeholder="🚀 or https://cdn.simpleicons.org/react"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  💡 Tip: Use emojis (🚀) or paste icon URLs from{' '}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <option value="language" className="bg-gray-800">Language</option>
                <option value="framework" className="bg-gray-800">Framework</option>
                <option value="devops" className="bg-gray-800">DevOps</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skill Level *</label>
              <select
                {...register('level', { required: 'Level is required' })}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.level ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <option value="beginner" className="bg-gray-800">Beginner</option>
                <option value="intermediate" className="bg-gray-800">Intermediate</option>
                <option value="advanced" className="bg-gray-800">Advanced</option>
              </select>
              {errors.level && <p className="mt-1 text-sm text-red-400">{errors.level.message}</p>}
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
        {technologies.map((tech) => (
          <div key={tech.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  {tech.icon.startsWith('http') ? (
                    <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-3xl">{tech.icon}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{tech.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(tech.category)}`}>
                      {tech.category}
                    </span>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(tech.level)}`}>
                      {tech.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(tech)} className="flex-1 px-3 py-2 text-sm text-purple-400 border border-purple-400/50 rounded hover:bg-purple-600/20 transition-colors">
                Edit
              </button>
              <button onClick={() => handleDelete(tech.id)} className="flex-1 px-3 py-2 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-600/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {technologies.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">No technologies yet. Add your first one!</p>
        </div>
      )}
    </div>
  )
}

export default TechnologiesManager
