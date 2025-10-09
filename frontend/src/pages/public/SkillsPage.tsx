// Public Skills page - displays skills and technologies
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'

/**
 * Skill interface
 */
interface Skill {
  id: string
  name: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: 'languages' | 'frameworks' | 'devops' | 'databases' | 'tools' | 'ui_design'
}

/**
 * SkillsPage Component
 * - Displays all skills
 * - Filter by skill level
 * - Search by name
 * - Grouped by level
 */
const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'languages' | 'frameworks' | 'devops' | 'databases' | 'tools' | 'ui_design'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Fetch skills from backend
   */
  useEffect(() => {
    const fetchSkills = async () => {
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
        // Convert level and category to lowercase for consistency
        const techs = (result.technologies || []).map((tech: any) => ({
          ...tech,
          level: tech.level.toLowerCase(),
          category: tech.category.toLowerCase()
        }))
        setSkills(techs)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  /**
   * Filter and search skills
   */
  const filteredSkills = skills.filter(skill => {
    // Filter by level
    if (filter !== 'all' && skill.level !== filter) {
      return false
    }

    // Filter by category
    if (categoryFilter !== 'all' && skill.category !== categoryFilter) {
      return false
    }

    // Search by name
    if (searchQuery) {
      return skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  /**
   * Group skills by level
   */
  const groupedSkills = {
    advanced: filteredSkills.filter(t => t.level === 'advanced'),
    intermediate: filteredSkills.filter(t => t.level === 'intermediate'),
    beginner: filteredSkills.filter(t => t.level === 'beginner')
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
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Skills & Technologies
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive list of skills I've learned and worked with
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
            </div>

            {/* Level Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              {['all', 'advanced', 'intermediate', 'beginner'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === level
                      ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-600 dark:hover:border-purple-400'
                  }`}
                >
                  {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center md:justify-start items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Category:</span>
            {[
              { value: 'all', label: 'All' },
              { value: 'languages', label: 'Languages' },
              { value: 'frameworks', label: 'Frameworks' },
              { value: 'devops', label: 'DevOps' },
              { value: 'databases', label: 'Databases' },
              { value: 'tools', label: 'Tools' },
              { value: 'ui_design', label: 'UI/Design' }
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setCategoryFilter(category.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  categoryFilter === category.value
                    ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-600 dark:hover:border-purple-400'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {filter === 'all' ? (
          <div className="space-y-12">
            {/* Advanced */}
            {groupedSkills.advanced.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Advanced
                  <span className="ml-3 text-base font-normal text-gray-500 dark:text-gray-400">
                    ({groupedSkills.advanced.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedSkills.advanced.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto">
                          {skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-4xl">{skill.icon}</span>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                            {skill.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {skill.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intermediate */}
            {groupedSkills.intermediate.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Intermediate
                  <span className="ml-3 text-base font-normal text-gray-500 dark:text-gray-400">
                    ({groupedSkills.intermediate.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedSkills.intermediate.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto">
                          {skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-4xl">{skill.icon}</span>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                            {skill.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {skill.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beginner */}
            {groupedSkills.beginner.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Beginner
                  <span className="ml-3 text-base font-normal text-gray-500 dark:text-gray-400">
                    ({groupedSkills.beginner.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedSkills.beginner.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto">
                          {skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-4xl">{skill.icon}</span>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                            {skill.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {skill.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Filtered View */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col space-y-4">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto">
                    {skill.icon.startsWith('http') ? (
                      <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-4xl">{skill.icon}</span>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {skill.level}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No skills found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillsPage
