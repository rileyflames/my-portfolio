// Comprehensive Admin Dashboard with tabs
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import AboutMeManager from './admin/AboutMeManager'
import SocialMediaManager from './admin/SocialMediaManager'
import TechnologiesManager from './admin/TechnologiesManager'
import UserManager from './admin/UserManager'
import MessagesManager from './admin/MessagesManager'

type TabType = 'projects' | 'about' | 'social' | 'technologies' | 'users' | 'messages'

/**
 * AdminDashboardTabs Component
 * - Tabbed interface for managing all portfolio content
 * - Projects, About Me, Social Media, Technologies
 */
const AdminDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>('messages')

  const tabs = [
    { id: 'messages' as TabType, label: 'Messages', icon: '📧' },
    { id: 'projects' as TabType, label: 'Projects', icon: '📁' },
    { id: 'about' as TabType, label: 'About Me', icon: '👤' },
    { id: 'social' as TabType, label: 'Social Media', icon: '🔗' },
    { id: 'technologies' as TabType, label: 'Technologies', icon: '⚡' },
    { id: 'users' as TabType, label: 'Users', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your portfolio content</p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              ← Back to Site
            </Link>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'messages' && <MessagesManager />}
          {activeTab === 'projects' && <AdminDashboard />}
          {activeTab === 'about' && <AboutMeManager />}
          {activeTab === 'social' && <SocialMediaManager />}
          {activeTab === 'technologies' && <TechnologiesManager />}
          {activeTab === 'users' && <UserManager />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardTabs