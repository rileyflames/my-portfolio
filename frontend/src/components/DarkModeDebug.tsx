/**
 * Dark Mode Debug Component
 * Add this to your Hero or any page to test dark mode
 */

import { useState, useEffect } from 'react'

const DarkModeDebug = () => {
  const [htmlClass, setHtmlClass] = useState('')
  const [storage, setStorage] = useState('')

  useEffect(() => {
    const updateInfo = () => {
      setHtmlClass(document.documentElement.className || 'none')
      setStorage(localStorage.getItem('darkMode') || 'not set')
    }

    updateInfo()
    
    // Update every second to catch changes
    const interval = setInterval(updateInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  const testDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
      console.log('🌞 Manually disabled dark mode')
    } else {
      html.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
      console.log('🌙 Manually enabled dark mode')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-2xl max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        🐛 Dark Mode Debug
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>HTML class:</strong> <code className="text-purple-600 dark:text-purple-400">{htmlClass}</code>
          </p>
        </div>
        
        <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>localStorage:</strong> <code className="text-purple-600 dark:text-purple-400">{storage}</code>
          </p>
        </div>

        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
          <p className="text-purple-800 dark:text-purple-300 text-xs">
            This box should change color when dark mode toggles
          </p>
        </div>
      </div>

      <button
        onClick={testDarkMode}
        className="mt-3 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded transition-colors"
      >
        Manual Toggle
      </button>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Check browser console for logs
      </p>
    </div>
  )
}

export default DarkModeDebug
