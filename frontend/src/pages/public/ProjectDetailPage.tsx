// Project Detail Page - displays full project information
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Github, ExternalLink, Calendar, Tag, ArrowLeft } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'
import { motion } from 'framer-motion'
import ImageGallery from '../../components/ImageGallery'

interface Project {
  id: string
  name: string
  githubLink: string
  liveUrl?: string
  progress: 'pending' | 'in-progress' | 'finished'
  imageUrl?: string
  images?: string[]
  description: string
  technologies: Array<{
    id: string
    name: string
    icon: string
  }>
  contributors?: Array<{
    id: string
    name: string
    email: string
    github: string
  }>
  tags?: string[]
  createdAt: string
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showContributorsPopup, setShowContributorsPopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowContributorsPopup(false)
      }
    }

    if (showContributorsPopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContributorsPopup])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await graphqlQuery(
          `
            query GetProject($id: String!) {
              project(id: $id) {
                id
                name
                githubLink
                liveUrl
                progress
                imageUrl
                images
                description
                technologies {
                  id
                  name
                  icon
                }
                contributors {
                  id
                  name
                  email
                  github
                }
                tags
                createdAt
              }
            }
          `,
          { id }
        )
        console.log('Project data:', result.project)
        console.log('Images array:', result.project?.images)
        setProject(result.project)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

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

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Project not found</p>
          <Link
            to="/projects"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
              {project.name}
            </h1>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 rounded-full text-sm font-medium capitalize w-fit">
              {formatStatus(project.progress)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              <Github className="w-5 h-5" />
              View Code
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition-colors font-semibold shadow-sm hover:shadow-md"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Project Gallery</h2>
            <ImageGallery images={project.images} projectName={project.name} />
          </motion.div>
        ) : project.imageUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          </motion.div>
        ) : null}

        {/* 
          Two Column Layout
          - Mobile: Single column (grid-cols-1)
          - Desktop: Main content (2 cols) + Sidebar (1 col) (lg:grid-cols-3)
          - gap-6: 24px on mobile
          - sm:gap-8: 32px on larger screens
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 
            Main Content Column
            - Takes 2 columns on desktop (lg:col-span-2)
            - Full width on mobile
            - space-y-6: 24px vertical spacing on mobile
            - sm:space-y-8: 32px on larger screens
          */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8"
          >
            {/* Description Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About This Project</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Contributors Section */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Contributors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.contributors.map((contributor) => (
                    <a
                      key={contributor.id}
                      href={contributor.github.startsWith('http') ? contributor.github : `https://github.com/${contributor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition-all group"
                    >
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg border border-purple-300 dark:border-purple-700 flex-shrink-0">
                        {contributor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-gray-100 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                          {contributor.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {contributor.github.startsWith('http') 
                            ? contributor.github.replace(/^https?:\/\/(www\.)?/, '')
                            : `github.com/${contributor.github}`}
                        </p>
                      </div>
                      <Github className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* 
            Sidebar Column
            - Takes 1 column on desktop (lg:col-span-1)
            - Full width on mobile
            - space-y-4: 16px vertical spacing on mobile
            - sm:space-y-6: 24px on larger screens
          */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 space-y-4 sm:space-y-6"
          >
            {/* Skills Section */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Skills Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      {tech.icon.startsWith('http') ? (
                        <img src={tech.icon} alt={tech.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <span className="text-lg">{tech.icon}</span>
                      )}
                      <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Section */}
            {project.tags && project.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Project Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    Created {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {project.contributors && project.contributors.length > 0 && (
                  <div className="relative" ref={popupRef}>
                    <button
                      onClick={() => setShowContributorsPopup(!showContributorsPopup)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer w-full"
                    >
                      <Github className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {project.contributors.length} Contributor{project.contributors.length !== 1 ? 's' : ''}
                      </span>
                    </button>
                    
                    {/* Contributors Popup */}
                    {showContributorsPopup && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Contributors</h4>
                          <button
                            onClick={() => setShowContributorsPopup(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2">
                          {project.contributors.map((contributor) => (
                            <a
                              key={contributor.id}
                              href={contributor.github.startsWith('http') ? contributor.github : `https://github.com/${contributor.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition-all group"
                            >
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm border border-purple-300 dark:border-purple-700 flex-shrink-0">
                                {contributor.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                                  {contributor.name}
                                </p>
                              </div>
                              <Github className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
