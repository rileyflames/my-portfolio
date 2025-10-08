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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Project Management Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your portfolio projects - Create, Read, Update, and Delete
                    </p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Filter by progress */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Filter:</label>
                        <select
                            value={filterProgress}
                            onChange={(e) => setFilterProgress(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        + Create New Project
                    </Link>
                </div>

                {/* Projects Table */}
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">No projects found</p>
                        <Link
                            to="/admin/projects/new"
                            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create your first project
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Technologies
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Links
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            {/* Project Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {project.imageUrl && (
                                                        <img
                                                            src={project.imageUrl}
                                                            alt={project.name}
                                                            className="h-10 w-10 rounded object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {project.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
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
                                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                                        >
                                                            {tech.name}
                                                        </span>
                                                    ))}
                                                    {(project.technologies?.length || 0) > 3 && (
                                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
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
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        GitHub
                                                    </a>
                                                    {project.liveUrl && (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-800"
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
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-red-600 hover:text-red-900"
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
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm text-gray-600">Total Projects</div>
                        <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {projects.filter(p => p.progress === 'in-progress').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-2xl font-bold text-green-600">
                            {projects.filter(p => p.progress === 'finished').length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard