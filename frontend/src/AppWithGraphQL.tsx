// Main App component with Apollo Client for GraphQL
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import client from './lib/apollo-client'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ContactWithGraphQL from './pages/ContactWithGraphQL'

/**
 * Main App Component with GraphQL Support
 * - Sets up Apollo Client for GraphQL communication with backend
 * - Configures React Router for navigation between pages
 * - Includes toast notifications for user feedback
 * - Provides consistent layout with navigation bar
 */
function AppWithGraphQL() {
  return (
    // ApolloProvider gives all child components access to GraphQL client
    <ApolloProvider client={client}>
      {/* Router enables navigation between different pages */}
      <Router>
        <div className="min-h-screen bg-gray-50 font-montserrat">
          {/* Navigation bar appears on all pages */}
          <Navbar />
          
          {/* Routes define which component to show for each URL path */}
          <Routes>
            {/* Home page shows the hero section */}
            <Route path="/" element={<Hero />} />
            {/* Contact page shows the contact form with GraphQL */}
            <Route path="/contact" element={<ContactWithGraphQL />} />
          </Routes>
          
          {/* Toast notifications for success/error messages */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default AppWithGraphQL