/**
 * Public Navigation Bar Component - The Odin Project Style
 * 
 * FEATURES:
 * - Clean, minimal design with light/dark mode support
 * - Dark mode toggle button
 * - Sticky header with subtle shadow
 * - Responsive mobile hamburger menu
 * - Purple accent colors
 */

import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { user, isAuthenticated } = useAuth()
  
  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  const isActive = (path: string) => location.pathname === path
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
            >
              <span className="text-2xl font-bold text-purple-600 dark:text-red-500" style={{ textShadow: '0 0 1px #a855f7, 0 0 2px #a855f7' }}>Logo</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                isActive('/projects')
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/skills"
              className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                isActive('/skills')
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Skills
            </Link>
            <Link
              to="/contact"
              className={`ml-2 px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200 ${
                isActive('/contact')
                  ? 'text-white bg-purple-600 dark:bg-purple-500' 
                  : 'text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
              }`}
            >
              Contact
            </Link>
            
            {/* Back to Admin Panel - Only visible for authenticated ADMIN/EDITOR users */}
            {isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
              <Link
                to="/admin/projects"
                className="ml-2 px-5 py-2 text-base font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 shadow-md hover:shadow-lg"
                title="Back to Admin Panel"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Dark Mode Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-purple-600"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70"
              style={{ zIndex: 9998, top: '64px' }}
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700 shadow-lg"
              style={{ 
                zIndex: 9999,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
            >
              <div className="px-4 py-4 space-y-1">
                <Link 
                  to="/" 
                  onClick={() => setMobileOpen(false)} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setMobileOpen(false)} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive('/about') 
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/projects" 
                  onClick={() => setMobileOpen(false)} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive('/projects') 
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Projects
                </Link>
                <Link 
                  to="/skills" 
                  onClick={() => setMobileOpen(false)} 
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive('/skills') 
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Skills
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors text-center"
                >
                  Contact
                </Link>
                
                {/* Back to Admin Panel - Mobile - Only visible for authenticated ADMIN/EDITOR users */}
                {isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
                  <Link 
                    to="/admin/projects" 
                    onClick={() => setMobileOpen(false)} 
                    className="block px-4 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Back to Admin Panel
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
