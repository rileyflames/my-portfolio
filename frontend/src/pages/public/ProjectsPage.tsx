// Public Projects page - The Odin Project Style
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, Search } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'
import { motion } from 'framer-motion'

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
  contributors?: Array<{
    id: string
    name: string
    github: string
  }>
  tags?: string[]
  createdAt: string
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'finished'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
              contributors {
                id
                name
                github
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

  const filteredProjects = projects.filter(project => {
    if (filter !== 'all' && project.progress !== filter) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
      finished: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of projects I've built while learning and growing as a developer
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              {['all', 'finished', 'in-progress', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === status
                      ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-600 dark:hover:border-purple-400'
                  }`}
                >
                  {status === 'all' ? 'All' : formatStatus(status)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">No projects found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                {/* Project Image */}
                <Link to={`/projects/${project.id}`} className="block">
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20">
                        <span className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(project.progress)}`}>
                        {formatStatus(project.progress)}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Project Content */}
                <div className="p-6">
                  <Link to={`/projects/${project.id}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contributors */}
                  {project.contributors && project.contributors.length > 0 && (
                    <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Contributors ({project.contributors.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.contributors.map((contributor) => (
                          <a
                            key={contributor.id}
                            href={contributor.github.startsWith('http') ? contributor.github : `https://github.com/${contributor.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:border-purple-600 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                            title={`${contributor.name} on GitHub`}
                          >
                            <Github className="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                            <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                              {contributor.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
