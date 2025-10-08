// Public About Me page - displays personal information
import { useState, useEffect } from 'react'
import { Calendar, Code, MapPin, Mail } from 'lucide-react'
import { graphqlQuery } from '../../lib/axios-client'

/**
 * AboutMe data interface
 */
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

/**
 * AboutPage Component
 * - Displays personal information from backend
 * - Shows profile picture, bio, technologies
 * - Links to social media
 * - Calculates years of coding experience
 */
const AboutPage = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Fetch About Me data from backend
   */
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

  /**
   * Calculate years of coding experience
   */
  const getYearsOfExperience = () => {
    if (!aboutMe?.startedCoding) return 0
    const startDate = new Date(aboutMe.startedCoding)
    const now = new Date()
    const years = now.getFullYear() - startDate.getFullYear()
    return years
  }

  /**
   * Calculate age
   */
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

  /**
   * Get skill level color
   */
  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      intermediate: 'bg-blue-100 text-blue-800 border-blue-300',
      advanced: 'bg-green-100 text-green-800 border-green-300'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!aboutMe) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">About information not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-neutral-300 overflow-hidden mb-8">
          <div className="md:flex">
            {/* Profile Image */}
            <div className="md:w-1/3 bg-primary p-8 flex items-center justify-center">
              {aboutMe.imageUrl ? (
                <img
                  src={aboutMe.imageUrl}
                  alt={aboutMe.fullName}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-6xl font-bold text-primary">
                    {aboutMe.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="md:w-2/3 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                {aboutMe.fullName}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 mb-6">
                Self-Taught Developer
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral-500">Age</p>
                    <p className="text-lg font-semibold text-neutral-900">{getAge()} years</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <Code className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral-500">Coding Experience</p>
                    <p className="text-lg font-semibold text-neutral-900">{getYearsOfExperience()}+ years</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {aboutMe.social && aboutMe.social.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {aboutMe.social.map((social) => (
                    <a
                      key={social.id}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                    >
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-2xl border border-neutral-300 p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4">About Me</h2>
          <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {aboutMe.bio}
          </p>
        </div>

        {/* Technologies Section */}
        {aboutMe.technologies && aboutMe.technologies.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
              Technologies & Skills
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {aboutMe.technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="p-4 border-2 border-neutral-300 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {tech.icon.startsWith('http') ? (
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl">{tech.icon}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{tech.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(tech.level)}`}>
                      {tech.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AboutPage