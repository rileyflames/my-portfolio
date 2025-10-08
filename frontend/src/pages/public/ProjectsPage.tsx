// Public Projects page - displays portfolio projects
import { useState, useEffect } from 'react'
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'

/**
 * Project interface
 */
interface Project {
  id: string
  name: string
  githubLink: string
  liveUrl?: string
  progress: 'pending' | 'in-progress' | 'finished'
  imageUrl?: string
  description: string
  technologies: Array<{
    id: string
    name: string
    icon: string
  }>
  tags?: string[]
  createdAt: string
}

/**
 * ProjectsPage Component
 * - Displays all portfolio projects
 * - Filter by status
 * - Search by name/description
 * - Shows project details, technologies, links
 */
const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'finished'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Fetch projects from backend
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await graphqlQuery(`
          query GetProjects {
            projects {
              id
              name
              githubLink
              liveUrl
              progress
              imageUrl
              description
              technologies {
                id
                name
                icon
              }
              tags
              createdAt
            }
          }
        `)
        setProjects(result.projects || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  /**
   * Filter and search projects
   */
  const filteredProjects = projects.filter(project => {
    // Filter by status
    if (filter !== 'all' && project.progress !== filter) {
      return false
    }

    // Search by name or description
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  /**
   * Get status badge color
   */
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      finished: 'bg-green-100 text-green-800 border-green-300'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  /**
   * Format status text
   */
  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            My Projects
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            A collection of projects I've built while learning and growing as a developer
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-neutral-300 p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'finished', 'in-progress', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {status === 'all' ? 'All' : formatStatus(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-300">
            <p className="text-neutral-600">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-neutral-300 overflow-hidden hover:border-primary transition-colors"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-primary">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-white opacity-50">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(project.progress)}`}>
                      {formatStatus(project.progress)}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm font-medium">Code</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Live</span>
                      </a>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg border border-neutral-300 p-6 text-center">
            <div className="text-3xl font-bold text-neutral-900 mb-2">
              {projects.length}
            </div>
            <div className="text-neutral-600 text-sm">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-300 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {projects.filter(p => p.progress === 'finished').length}
            </div>
            <div className="text-neutral-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-300 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {projects.filter(p => p.progress === 'in-progress').length}
            </div>
            <div className="text-neutral-600 text-sm">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage