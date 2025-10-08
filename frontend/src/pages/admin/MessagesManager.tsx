// Messages Management page with inbox, recycle bin, and bulk operations
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'

/**
 * Message interface - represents a contact form message
 */
interface Message {
  id: string
  fullName: string
  email: string
  city: string
  subject: string
  messageDescription: string
  isRead: boolean
  readAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Message statistics interface
 */
interface MessageStats {
  total: number
  unread: number
  read: number
  deleted: number
}

/**
 * View type - determines which messages to show
 */
type ViewType = 'inbox' | 'unread' | 'read' | 'trash'

/**
 * MessagesManager Component
 * - View all contact messages from visitors
 * - Mark messages as read/unread
 * - Search and filter messages
 * - Soft delete to recycle bin
 * - Restore or permanently delete from trash
 * - Bulk operations (delete, restore)
 * - Message statistics and notifications
 */
const MessagesManager = () => {
  // State for messages and UI
  const [messages, setMessages] = useState<Message[]>([]) // All active messages
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]) // Trash messages
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, read: 0, deleted: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('inbox') // Current view tab
  const [searchTerm, setSearchTerm] = useState('') // Search input value
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null) // Message being viewed
  const [selectedIds, setSelectedIds] = useState<string[]>([]) // IDs of selected messages for bulk operations

  /**
   * Fetch all active messages (not deleted)
   * This runs when component mounts and after any changes
   */
  const fetchMessages = async () => {
    try {
      const result = await graphqlQuery(`
        query GetMessages {
          messages {
            id
            fullName
            email
            city
            subject
            messageDescription
            isRead
            readAt
            createdAt
            updatedAt
          }
        }
      `)
      setMessages(result.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    }
  }

  /**
   * Fetch deleted messages (recycle bin)
   */
  const fetchDeletedMessages = async () => {
    try {
      const result = await graphqlQuery(`
        query GetDeletedMessages {
          deletedMessages {
            id
            fullName
            email
            city
            subject
            messageDescription
            isRead
            readAt
            createdAt
            updatedAt
          }
        }
      `)
      setDeletedMessages(result.deletedMessages || [])
    } catch (error) {
      console.error('Error fetching deleted messages:', error)
      toast.error('Failed to load trash')
    }
  }

  /**
   * Fetch message statistics (counts)
   */
  const fetchStats = async () => {
    try {
      const result = await graphqlQuery(`
        query GetMessageStats {
          messageStats {
            total
            unread
            read
            deleted
          }
        }
      `)
      setStats(result.messageStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  /**
   * Load all data when component mounts
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchMessages(),
        fetchDeletedMessages(),
        fetchStats()
      ])
      setIsLoading(false)
    }
    loadData()
  }, [])

  /**
   * Mark a message as read
   * @param id - Message ID to mark as read
   */
  const markAsRead = async (id: string) => {
    try {
      await graphqlMutation(
        `mutation MarkAsRead($id: String!) {
          markMessageAsRead(id: $id) {
            id
            isRead
            readAt
          }
        }`,
        { id }
      )
      // Update local state
      setMessages(messages.map(m => 
        m.id === id ? { ...m, isRead: true, readAt: new Date().toISOString() } : m
      ))
      fetchStats() // Refresh stats
      toast.success('Marked as read')
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  /**
   * Mark a message as unread
   * @param id - Message ID to mark as unread
   */
  const markAsUnread = async (id: string) => {
    try {
      await graphqlMutation(
        `mutation MarkAsUnread($id: String!) {
          markMessageAsUnread(id: $id) {
            id
            isRead
            readAt
          }
        }`,
        { id }
      )
      // Update local state
      setMessages(messages.map(m => 
        m.id === id ? { ...m, isRead: false, readAt: null } : m
      ))
      fetchStats() // Refresh stats
      toast.success('Marked as unread')
    } catch (error) {
      toast.error('Failed to mark as unread')
    }
  }

  /**
   * Soft delete a message (move to trash)
   * @param id - Message ID to delete
   */
  const deleteMessage = async (id: string) => {
    try {
      await graphqlMutation(
        `mutation SoftDelete($id: String!) {
          softDeleteMessage(id: $id)
        }`,
        { id }
      )
      // Remove from messages list
      setMessages(messages.filter(m => m.id !== id))
      toast.success('Message moved to trash')
      fetchDeletedMessages() // Refresh trash
      fetchStats() // Refresh stats
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  /**
   * Restore a message from trash
   * @param id - Message ID to restore
   */
  const restoreMessage = async (id: string) => {
    try {
      await graphqlMutation(
        `mutation Restore($id: String!) {
          restoreMessage(id: $id) {
            id
            fullName
            email
            city
            subject
            messageDescription
            isRead
            readAt
            createdAt
            updatedAt
          }
        }`,
        { id }
      )
      // Remove from trash
      setDeletedMessages(deletedMessages.filter(m => m.id !== id))
      toast.success('Message restored')
      fetchMessages() // Refresh messages
      fetchStats() // Refresh stats
    } catch (error) {
      toast.error('Failed to restore message')
    }
  }

  /**
   * Permanently delete a message (cannot be undone!)
   * @param id - Message ID to permanently delete
   */
  const permanentDelete = async (id: string) => {
    if (!confirm('Permanently delete this message? This cannot be undone!')) {
      return
    }
    try {
      await graphqlMutation(
        `mutation PermanentDelete($id: String!) {
          permanentDeleteMessage(id: $id)
        }`,
        { id }
      )
      // Remove from trash
      setDeletedMessages(deletedMessages.filter(m => m.id !== id))
      toast.success('Message permanently deleted')
      fetchStats() // Refresh stats
    } catch (error) {
      toast.error('Failed to permanently delete message')
    }
  }

  /**
   * Bulk delete selected messages
   */
  const bulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('No messages selected')
      return
    }
    if (!confirm(`Delete ${selectedIds.length} message(s)?`)) {
      return
    }
    try {
      // Delete each selected message
      await Promise.all(selectedIds.map(id => 
        graphqlMutation(
          `mutation SoftDelete($id: String!) { softDeleteMessage(id: $id) }`,
          { id }
        )
      ))
      toast.success(`${selectedIds.length} message(s) moved to trash`)
      setSelectedIds([]) // Clear selection
      fetchMessages()
      fetchDeletedMessages()
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete messages')
    }
  }

  /**
   * Bulk restore selected messages from trash
   */
  const bulkRestore = async () => {
    if (selectedIds.length === 0) {
      toast.error('No messages selected')
      return
    }
    try {
      // Restore each selected message
      await Promise.all(selectedIds.map(id => 
        graphqlMutation(
          `mutation Restore($id: String!) { restoreMessage(id: $id) { id } }`,
          { id }
        )
      ))
      toast.success(`${selectedIds.length} message(s) restored`)
      setSelectedIds([]) // Clear selection
      fetchMessages()
      fetchDeletedMessages()
      fetchStats()
    } catch (error) {
      toast.error('Failed to restore messages')
    }
  }

  /**
   * Toggle selection of a message for bulk operations
   * @param id - Message ID to toggle
   */
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  /**
   * Select all visible messages
   */
  const selectAll = () => {
    const visibleMessages = getFilteredMessages()
    setSelectedIds(visibleMessages.map(m => m.id))
  }

  /**
   * Deselect all messages
   */
  const deselectAll = () => {
    setSelectedIds([])
  }

  /**
   * Get filtered messages based on current view and search term
   * @returns Filtered array of messages
   */
  const getFilteredMessages = (): Message[] => {
    let filtered = currentView === 'trash' ? deletedMessages : messages

    // Filter by view type
    if (currentView === 'unread') {
      filtered = filtered.filter(m => !m.isRead)
    } else if (currentView === 'read') {
      filtered = filtered.filter(m => m.isRead)
    }

    // Filter by search term (searches in name, email, subject, message)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(m =>
        m.fullName.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        m.messageDescription.toLowerCase().includes(term)
      )
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  /**
   * Open a message to view its full content
   * Automatically marks as read when opened
   * @param message - Message to view
   */
  const openMessage = async (message: Message) => {
    setSelectedMessage(message)
    // Mark as read if not already read
    if (!message.isRead && currentView !== 'trash') {
      await markAsRead(message.id)
    }
  }

  /**
   * Close the message viewer
   */
  const closeMessage = () => {
    setSelectedMessage(null)
  }

  // Get filtered messages for display
  const filteredMessages = getFilteredMessages()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <p className="text-gray-600">Manage contact form submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total Messages</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg" onClick={() => setCurrentView('unread')}>
          <div className="text-sm text-gray-600">Unread</div>
          <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
          {stats.unread > 0 && (
            <div className="mt-1 text-xs text-orange-600">● New messages</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg" onClick={() => setCurrentView('read')}>
          <div className="text-sm text-gray-600">Read</div>
          <div className="text-2xl font-bold text-green-600">{stats.read}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg" onClick={() => setCurrentView('trash')}>
          <div className="text-sm text-gray-600">Trash</div>
          <div className="text-2xl font-bold text-red-600">{stats.deleted}</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'inbox' as ViewType, label: 'Inbox', icon: '📥' },
              { id: 'unread' as ViewType, label: 'Unread', icon: '🔵', count: stats.unread },
              { id: 'read' as ViewType, label: 'Read', icon: '✅' },
              { id: 'trash' as ViewType, label: 'Trash', icon: '🗑️', count: stats.deleted },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentView(tab.id)
                  setSelectedIds([])
                }}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                  ${currentView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Bulk Actions */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <>
                <span className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
                  {selectedIds.length} selected
                </span>
                {currentView === 'trash' ? (
                  <>
                    <button
                      onClick={bulkRestore}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Restore Selected
                    </button>
                  </>
                ) : (
                  <button
                    onClick={bulkDelete}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                )}
                <button
                  onClick={deselectAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Deselect All
                </button>
              </>
            )}
            {selectedIds.length === 0 && filteredMessages.length > 0 && (
              <button
                onClick={selectAll}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Select All
              </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="divide-y divide-gray-200">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? 'No messages found matching your search' : 'No messages in this view'}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !message.isRead && currentView !== 'trash' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox for bulk selection */}
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(message.id)}
                    onChange={() => toggleSelection(message.id)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded"
                  />

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.fullName}
                          </h3>
                          {!message.isRead && currentView !== 'trash' && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{message.email} • {message.city}</p>
                        <p className={`text-sm mt-1 ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {message.messageDescription}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {currentView === 'trash' ? (
                          <>
                            <button
                              onClick={() => restoreMessage(message.id)}
                              className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50"
                              title="Restore message"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => permanentDelete(message.id)}
                              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                              title="Permanently delete"
                            >
                              Delete Forever
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openMessage(message)}
                              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                              title="Open message"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                              title="Move to trash"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Viewer Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {selectedMessage.fullName} ({selectedMessage.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {selectedMessage.city}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={closeMessage}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.messageDescription}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              {selectedMessage.isRead ? (
                <button
                  onClick={() => {
                    markAsUnread(selectedMessage.id)
                    closeMessage()
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Mark as Unread
                </button>
              ) : (
                <button
                  onClick={() => {
                    markAsRead(selectedMessage.id)
                    closeMessage()
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  deleteMessage(selectedMessage.id)
                  closeMessage()
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={closeMessage}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesManager