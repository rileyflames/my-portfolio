// Hero section component - The Odin Project Style
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { graphqlQuery } from '../lib/axios-client'

const Hero = () => {
  const [socialLinks, setSocialLinks] = useState<any[]>([])

  // Fetch social media links from backend
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

  const getSocialIcon = (name: string, iconUrl: string) => {
    if (iconUrl && iconUrl.startsWith('http')) {
      return <img src={iconUrl} alt={name} className="w-6 h-6 object-contain" />
    }
    
    if (iconUrl && !iconUrl.startsWith('http')) {
      return <span className="text-2xl">{iconUrl}</span>
    }

    const nameLower = name.toLowerCase()
    if (nameLower.includes('github')) return <Github className="w-6 h-6" />
    if (nameLower.includes('linkedin')) return <Linkedin className="w-6 h-6" />
    if (nameLower.includes('twitter') || nameLower.includes('x')) return <Twitter className="w-6 h-6" />
    if (nameLower.includes('email') || nameLower.includes('mail')) return <Mail className="w-6 h-6" />
    
    return <span className="text-xl font-bold">{name.charAt(0)}</span>
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Hi, I'm <Link to="/about" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 cursor-pointer">Your Name</Link>
              </motion.h1>
              
              <motion.p
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                A self-taught developer passionate about crafting elegant solutions and building meaningful digital experiences.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link
                  to="/projects"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  View Projects
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get in Touch
                </Link>
              </motion.div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <motion.div
                  className="flex gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:border-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:border-purple-500 transition-all duration-200"
                      aria-label={social.name}
                      title={social.name}
                    >
                      {getSocialIcon(social.name, social.icon)}
                    </a>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Illustration/Image Placeholder */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-full max-w-lg h-96 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">👨‍💻</div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Building the future, one line at a time
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What I Do
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fueled by curiosity and driven by creativity, I transform ideas into elegant digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Frontend Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating responsive and intuitive user interfaces with modern frameworks and best practices.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Backend Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Building robust APIs and server-side applications with scalable architecture.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Full Stack Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                End-to-end solutions combining frontend elegance with backend power.
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-lg"
            >
              Learn more about me
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
