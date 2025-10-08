// Public Technologies page - displays skills and technologies
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'

/**
 * Technology interface
 */
interface Technology {
  id: string
  name: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * TechnologiesPage Component
 * - Displays all technologies/skills
 * - Filter by skill level
 * - Search by name
 * - Grouped by level
 */
const TechnologiesPage = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Fetch technologies from backend
   */
  useEffect(() => {
    const fetchTechnologies = async () => {
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  /**
   * Filter and search technologies
   */
  const filteredTechnologies = technologies.filter(tech => {
    // Filter by level
    if (filter !== 'all' && tech.level !== filter) {
      return false
    }

    // Search by name
    if (searchQuery) {
      return tech.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  /**
   * Group technologies by level
   */
  const groupedTechnologies = {
    advanced: filteredTechnologies.filter(t => t.level === 'advanced'),
    intermediate: filteredTechnologies.filter(t => t.level === 'intermediate'),
    beginner: filteredTechnologies.filter(t => t.level === 'beginner')
  }

  /**
   * Get level color
   */
  const getLevelColor = (level: string) => {
    const colors = {
      beginner: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100'
      },
      intermediate: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-800',
        badge: 'bg-blue-100'
      },
      advanced: {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        badge: 'bg-green-100'
      }
    }
    return colors[level as keyof typeof colors] || colors.beginner
  }

  /**
   * Get level icon
   */
  const getLevelIcon = (level: string) => {
    const icons = {
      beginner: '🌱',
      intermediate: '🚀',
      advanced: '⭐'
    }
    return icons[level as keyof typeof icons] || '📚'
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
            Technologies & Skills
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            A comprehensive list of technologies I've learned and worked with
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-neutral-300 p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'advanced', 'intermediate', 'beginner'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level as any)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    filter === level
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies by Level */}
        {filter === 'all' ? (
          <div className="space-y-8">
            {/* Advanced */}
            {groupedTechnologies.advanced.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getLevelIcon('advanced')}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Advanced</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {groupedTechnologies.advanced.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedTechnologies.advanced.map((tech) => {
                    const colors = getLevelColor(tech.level)
                    return (
                      <div
                        key={tech.id}
                        className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-16 h-16 flex items-center justify-center">
                            {tech.icon.startsWith('http') ? (
                              <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-4xl">{tech.icon}</span>
                            )}
                          </div>
                          <h3 className={`font-bold ${colors.text}`}>{tech.name}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Intermediate */}
            {groupedTechnologies.intermediate.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getLevelIcon('intermediate')}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Intermediate</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {groupedTechnologies.intermediate.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedTechnologies.intermediate.map((tech) => {
                    const colors = getLevelColor(tech.level)
                    return (
                      <div
                        key={tech.id}
                        className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-16 h-16 flex items-center justify-center">
                            {tech.icon.startsWith('http') ? (
                              <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-4xl">{tech.icon}</span>
                            )}
                          </div>
                          <h3 className={`font-bold ${colors.text}`}>{tech.name}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Beginner */}
            {groupedTechnologies.beginner.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getLevelIcon('beginner')}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Beginner</h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {groupedTechnologies.beginner.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedTechnologies.beginner.map((tech) => {
                    const colors = getLevelColor(tech.level)
                    return (
                      <div
                        key={tech.id}
                        className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-16 h-16 flex items-center justify-center">
                            {tech.icon.startsWith('http') ? (
                              <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-4xl">{tech.icon}</span>
                            )}
                          </div>
                          <h3 className={`font-bold ${colors.text}`}>{tech.name}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Filtered View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTechnologies.map((tech) => {
              const colors = getLevelColor(tech.level)
              return (
                <div
                  key={tech.id}
                  className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 flex items-center justify-center">
                      {tech.icon.startsWith('http') ? (
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-4xl">{tech.icon}</span>
                      )}
                    </div>
                    <h3 className={`font-bold ${colors.text}`}>{tech.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors.badge} ${colors.text}`}>
                      {tech.level}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredTechnologies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-300">
            <p className="text-neutral-600">No technologies found</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg border border-neutral-300 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              {technologies.length}
            </div>
            <div className="text-neutral-600 text-xs sm:text-sm">Total Technologies</div>
          </div>
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              {groupedTechnologies.advanced.length}
            </div>
            <div className="text-green-800 font-medium text-xs sm:text-sm">Advanced</div>
          </div>
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {groupedTechnologies.intermediate.length}
            </div>
            <div className="text-blue-800 font-medium text-xs sm:text-sm">Intermediate</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-200 p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
              {groupedTechnologies.beginner.length}
            </div>
            <div className="text-yellow-800 font-medium text-xs sm:text-sm">Beginner</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnologiesPage