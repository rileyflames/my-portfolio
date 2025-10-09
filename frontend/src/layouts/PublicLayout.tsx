/**
 * Public Layout Component
 * 
 * PURPOSE: Wraps all public-facing pages (Home, About, Projects, Contact)
 * 
 * FEATURES:
 * - Includes public navigation bar
 * - Includes footer
 * - Consistent styling for public pages
 * 
 * SECURITY: This layout is for non-authenticated users
 * It does NOT include any admin links or references
 */

import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PublicLayout = () => {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Public navigation - no admin links */}
      <Navbar />
      
      {/* Page content renders here - prevent horizontal overflow */}
      <div className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PublicLayout
