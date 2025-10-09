// Comprehensive Admin Dashboard with tabs
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import AdminDashboard from './AdminDashboard'
import AboutMeManager from './admin/AboutMeManager'
import SocialMediaManager from './admin/SocialMediaManager'
import TechnologiesManager from './admin/TechnologiesManager'
import UserManager from './admin/UserManager'
import MessagesManager from './admin/MessagesManager'
import ContributorsManager from './admin/ContributorsManager'

type TabType = 'projects' | 'about' | 'social' | 'technologies' | 'contributors' | 'users' | 'messages'

/**
 * AdminDashboardTabs Component
 * - Tabbed interface for managing all portfolio content
 * - Projects, About Me, Social Media, Technologies
 */
const AdminDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Get saved tab from localStorage, default to 'projects'
    const savedTab = localStorage.getItem('adminActiveTab') as TabType
    return savedTab || 'projects'
  })
  const [darkMode, setDarkMode] = useState(false)

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

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab)
  }, [activeTab])

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

  const tabs = [
    { id: 'projects' as TabType, label: 'Projects', icon: '📁' },
    { id: 'about' as TabType, label: 'About Me', icon: '👤' },
    { id: 'social' as TabType, label: 'Social Media', icon: '🔗' },
    { id: 'technologies' as TabType, label: 'Technologies', icon: '⚡' },
    { id: 'contributors' as TabType, label: 'Contributors', icon: '👥' },
    { id: 'messages' as TabType, label: 'Messages', icon: '📧' },
    { id: 'users' as TabType, label: 'Users', icon: '🔧' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'projects' && <AdminDashboard />}
          {activeTab === 'about' && <AboutMeManager />}
          {activeTab === 'social' && <SocialMediaManager />}
          {activeTab === 'technologies' && <TechnologiesManager />}
          {activeTab === 'contributors' && <ContributorsManager />}
          {activeTab === 'messages' && <MessagesManager />}
          {activeTab === 'users' && <UserManager />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardTabs