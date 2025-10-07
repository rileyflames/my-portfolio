import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Projects } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { UploadService } from '../upload/upload.service';
import type { FileUpload } from '../upload/upload.service';
import { GraphQLUpload } from '../upload/scalars/upload.scalar';

/**
 * ProjectsResolver handles GraphQL queries and mutations for projects
 * This is the entry point for all project-related GraphQL operations
 */
@Resolver(() => Projects)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly uploadService: UploadService
  ) { }

  /**
   * GraphQL Query: Get all projects
   * Query: { 
   *   projects { 
   *     id name githubLink liveUrl progress description
   *     technologies { id name icon level }
   *     createdBy { id name email }
   *   } 
   * }
   */
  @Query(() => [Projects], {
    name: 'projects',
    description: 'Get all projects with their technologies and creators'
  })
  async getAllProjects(): Promise<Projects[]> {
    return this.projectsService.findAll();
  }

  /**
   * GraphQL Query: Get a single project by ID
   * Query: { 
   *   project(id: "uuid") { 
   *     id name description technologies { name } 
   *   } 
   * }
   */
  @Query(() => Projects, {
    name: 'project',
    description: 'Get a single project by ID',
    nullable: true
  })
  async getProject(@Args('id') id: string): Promise<Projects> {
    return this.projectsService.findOne(id);
  }

  /**
   * GraphQL Query: Get projects by creator
   * Query: { 
   *   projectsByCreator(creatorId: "uuid") { 
   *     id name createdBy { name } 
   *   } 
   * }
   */
  @Query(() => [Projects], {
    name: 'projectsByCreator',
    description: 'Get all projects created by a specific user'
  })
  async getProjectsByCreator(@Args('creatorId') creatorId: string): Promise<Projects[]> {
    return this.projectsService.findByCreator(creatorId);
  }

  /**
   * GraphQL Query: Get projects by progress status
   * Query: { 
   *   projectsByProgress(progress: "finished") { 
   *     id name progress 
   *   } 
   * }
   */
  @Query(() => [Projects], {
    name: 'projectsByProgress',
    description: 'Get projects filtered by progress status'
  })
  async getProjectsByProgress(
    @Args('progress') progress: 'pending' | 'in-progress' | 'finished'
  ): Promise<Projects[]> {
    return this.projectsService.findByProgress(progress);
  }

  /**
   * GraphQL Mutation: Create a new project
   * Mutation: { 
   *   createProject(input: { 
   *     name: "My App", 
   *     githubLink: "https://github.com/user/repo",
   *     description: "A cool app",
   *     progress: "in-progress",
   *     createdById: "user-uuid",
   *     technologyIds: ["tech-uuid-1", "tech-uuid-2"]
   *   }) {
   *     id name technologies { name }
   *   }
   * }
   */
  @Mutation(() => Projects, {
    description: 'Create a new project'
  })
  async createProject(
    @Args('input') createProjectInput: CreateProjectInput
  ): Promise<Projects> {
    return this.projectsService.create(createProjectInput);
  }

  /**
   * GraphQL Mutation: Update an existing project
   * Mutation: {
   *   updateProject(id: "uuid", input: { 
   *     progress: "finished",
   *     liveUrl: "https://myapp.com",
   *     editedById: "editor-uuid"
   *   }) {
   *     id name progress liveUrl editedBy { name }
   *   }
   * }
   */
  @Mutation(() => Projects, {
    description: 'Update an existing project'
  })
  async updateProject(
    @Args('id') id: string,
    @Args('input') updateProjectInput: UpdateProjectInput
  ): Promise<Projects> {
    return this.projectsService.update(id, updateProjectInput);
  }

  /**
   * GraphQL Mutation: Delete a project
   * Mutation: { deleteProject(id: "uuid") }
   */
  @Mutation(() => Boolean, {
    description: 'Delete a project'
  })
  async deleteProject(@Args('id') id: string): Promise<boolean> {
    return this.projectsService.remove(id);
  }

  /**
   * GraphQL Mutation: Upload and set project image
   * Mutation: { uploadProjectImage(projectId: "uuid", file: Upload!) }
   */
  @Mutation(() => Projects, {
    description: 'Upload and set image for a project'
  })
  async uploadProjectImage(
    @Args('projectId') projectId: string,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<Projects> {
    // Upload the image
    const imageUrl = await this.uploadService.uploadImage(file, 'projects');
    
    // Update the project with the new image URL
    return this.projectsService.update(projectId, { imageUrl });
  }
}