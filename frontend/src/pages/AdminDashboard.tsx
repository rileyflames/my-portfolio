// Admin Dashboard for managing projects
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'

/**
 * TypeScript interface for Project
 * Matches the backend Project entity structure
 */
interface Project {
    id: string
    name: string
    githubLink: string
    liveUrl?: string
    progress: 'pending' | 'in-progress' | 'finished'
    imageUrl?: string
    description: string
    technologies?: Array<{ id: string; name: string }>
    tags?: string[]
    createdAt: string
    updatedAt: string
}

/**
 * Admin Dashboard Component
 * - Displays all projects in a table
 * - Allows CRUD operations on projects
 * - Connects to backend GraphQL API
 */
const AdminDashboard = () => {
    // State for storing projects list
    const [projects, setProjects] = useState<Project[]>([])
    // Loading state
    const [isLoading, setIsLoading] = useState(true)
    // Filter by progress status
    const [filterProgress, setFilterProgress] = useState<string>('all')

    /**
     * Fetch all projects from backend using axios
     */
    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const result = await graphqlQuery(`
                query GetProjects {
                  projects {
                    id
                    name
                    githubLink
                    liveUrl
                    progress
                    imageUrl
                    description
                    technologies {
                      id
                      name
                    }
                    tags
                    createdAt
                    updatedAt
                  }
                }
            `)

            setProjects(result.projects)
        } catch (error) {
            console.error('Error fetching projects:', error)
            toast.error('Failed to load projects')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Delete a project using axios
     * @param id - Project ID to delete
     */
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return
        }

        try {
            await graphqlMutation(
                `
                    mutation DeleteProject($id: String!) {
                      deleteProject(id: $id)
                    }
                `,
                { id }
            )

            toast.success('Project deleted successfully')
            // Refresh the projects list
            fetchProjects()
        } catch (error) {
            console.error('Error deleting project:', error)
            toast.error('Failed to delete project')
        }
    }

    /**
     * Get badge color based on progress status
     */
    const getProgressBadge = (progress: string) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            'finished': 'bg-green-100 text-green-800'
        }
        return colors[progress as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    // Load projects when component mounts
    useEffect(() => {
        fetchProjects()
    }, [])

    // Filter projects based on selected progress
    const filteredProjects = filterProgress === 'all'
        ? projects
        : projects.filter(p => p.progress === filterProgress)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your portfolio projects
                </p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Filter by progress */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                    <select
                        value={filterProgress}
                        onChange={(e) => setFilterProgress(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Projects</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="finished">Finished</option>
                    </select>
                </div>

                {/* Create new project button */}
                <Link
                    to="/admin/projects/new"
                    className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                    + Create New Project
                </Link>
            </div>

            {/* Projects Table */}
            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No projects found</p>
                    <Link
                        to="/admin/projects/new"
                        className="inline-block mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                        Create your first project
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: '35%' }}>
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: '15%' }}>
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: '20%' }}>
                                        Technologies
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: '15%' }}>
                                        Links
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: '15%' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {/* Project Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {project.imageUrl && (
                                                    <img
                                                        src={project.imageUrl}
                                                        alt={project.name}
                                                        className="h-10 w-10 rounded object-cover mr-3 flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {project.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {project.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getProgressBadge(project.progress)}`}>
                                                {project.progress}
                                            </span>
                                        </td>

                                        {/* Technologies */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {project.technologies?.slice(0, 3).map((tech) => (
                                                    <span
                                                        key={tech.id}
                                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                                                    >
                                                        {tech.name}
                                                    </span>
                                                ))}
                                                {(project.technologies?.length || 0) > 3 && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                        +{(project.technologies?.length || 0) - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Links */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex flex-col gap-1">
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                                                >
                                                    GitHub
                                                </a>
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                                    >
                                                        Live Demo
                                                    </a>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/admin/projects/edit/${project.id}`}
                                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{projects.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {projects.filter(p => p.progress === 'in-progress').length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {projects.filter(p => p.progress === 'finished').length}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard