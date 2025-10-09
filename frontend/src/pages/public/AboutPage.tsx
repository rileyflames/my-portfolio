// Public About Me page - The Odin Project Style
import { useState, useEffect } from 'react'
import { Calendar, Code } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'
import { motion } from 'framer-motion'

interface AboutMe {
  id: string
  fullName: string
  dob: string
  startedCoding: string
  bio: string
  imageUrl?: string
  technologies: Array<{
    id: string
    name: string
    icon: string
    level: string
  }>
  social: Array<{
    id: string
    name: string
    link: string
    icon: string
  }>
}

const AboutPage = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const result = await graphqlQuery(`
          query GetAboutMe {
            aboutMe {
              id
              fullName
              dob
              startedCoding
              bio
              imageUrl
              technologies {
                id
                name
                icon
                level
              }
              social {
                id
                name
                link
                icon
              }
            }
          }
        `)
        setAboutMe(result.aboutMe)
      } catch (error) {
        console.error('Error fetching about me:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutMe()
  }, [])

  const getYearsOfExperience = () => {
    if (!aboutMe?.startedCoding) return 0
    const startDate = new Date(aboutMe.startedCoding)
    const now = new Date()
    const years = now.getFullYear() - startDate.getFullYear()
    return years
  }

  const getAge = () => {
    if (!aboutMe?.dob) return 0
    const birthDate = new Date(aboutMe.dob)
    const now = new Date()
    let age = now.getFullYear() - birthDate.getFullYear()
    const monthDiff = now.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700',
      intermediate: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
      advanced: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  if (!aboutMe) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">About information not available</p>
        </div>
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
            About Me
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know more about my journey as a self-taught developer
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column - Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm sticky top-20">
              {/* Profile Picture */}
              <div className="mb-6">
                {aboutMe.imageUrl ? (
                  <img
                    src={aboutMe.imageUrl}
                    alt={aboutMe.fullName}
                    className="w-full h-64 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-64 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center">
                    <span className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                      {aboutMe.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Title */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {aboutMe.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Self-Taught Developer
              </p>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{getAge()} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{getYearsOfExperience()}+ years</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {aboutMe.social && aboutMe.social.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Connect</p>
                  <div className="flex flex-wrap gap-2">
                    {aboutMe.social.map((social) => (
                      <a
                        key={social.id}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:border-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:border-purple-500 transition-all text-sm"
                      >
                        {social.icon && (
                          social.icon.startsWith('http') ? (
                            <img src={social.icon} alt={social.name} className="w-4 h-4" />
                          ) : (
                            <span className="text-lg">{social.icon}</span>
                          )
                        )}
                        <span>{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Bio */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                My Story
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {aboutMe.bio}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        {aboutMe.technologies && aboutMe.technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Skills & Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {aboutMe.technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-purple-600 dark:hover:border-purple-400 transition-all"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {tech.icon.startsWith('http') ? (
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-3xl">{tech.icon}</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{tech.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getLevelColor(tech.level)}`}>
                      {tech.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AboutPage
