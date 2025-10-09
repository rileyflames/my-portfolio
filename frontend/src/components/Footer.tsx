/**
 * Footer Component - The Odin Project Style
 * Multi-column layout with sections for About, Projects, Connect, and Legal
 */

import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { graphqlQuery } from '../lib/axios-client'

interface SocialLink {
  id: string
  name: string
  link: string
  icon: string
}

function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const result = await graphqlQuery(`
          query GetSocialMedia {
            mySocialMediaLinks {
              id
              name
              link
              icon
            }
          }
        `)
        setSocialLinks(result.mySocialMediaLinks || [])
      } catch (error) {
        console.error('Error fetching social links:', error)
      }
    }
    fetchSocialLinks()
  }, [])

  const getSocialIcon = (name: string) => {
    const nameLower = name.toLowerCase()
    if (nameLower.includes('github')) return <Github className="w-5 h-5" />
    if (nameLower.includes('linkedin')) return <Linkedin className="w-5 h-5" />
    if (nameLower.includes('twitter') || nameLower.includes('x')) return <Twitter className="w-5 h-5" />
    if (nameLower.includes('email') || nameLower.includes('mail')) return <Mail className="w-5 h-5" />
    return <span className="text-lg">{name.charAt(0)}</span>
  }

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 transition-all duration-200 hover:opacity-80"
          >
            <span className="text-xl font-bold text-purple-600 dark:text-red-500" style={{ textShadow: '0 0 1px #a855f7, 0 0 2px #a855f7' }}>Logo</span>
          </Link>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* About Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A self-taught developer passionate about building elegant solutions and meaningful digital experiences.
            </p>
            <Link 
              to="/about" 
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Projects Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Projects</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/projects" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/skills" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Get in Touch
                </Link>
              </li>
              {socialLinks.slice(0, 3).map((social) => (
                <li key={social.id}>
                  <a 
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Follow</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 transition-all"
                  aria-label={social.name}
                  title={social.name}
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Your Name. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with NestJS and React
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
