import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Projects } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Image } from '../images/entities/image.entity';

/**
 * ProjectsResolver handles GraphQL queries and mutations for projects
 * 
 * SECURITY MODEL:
 * - Public queries: Anyone can view projects (no authentication required)
 * - Admin mutations: Only authenticated ADMIN users can create/update/delete
 * 
 * This ensures your portfolio is publicly viewable while keeping
 * content management restricted to authorized users only
 */
@Resolver(() => Projects)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService
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
   * 
   * SECURITY: Requires authentication + ADMIN role
   * - User must have valid JWT token
   * - User must have ADMIN role
   * - Returns 401 if not authenticated
   * - Returns 403 if not ADMIN
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Projects, {
    description: 'Create a new project (ADMIN only)'
  })
  async createProject(
    @Args('input') createProjectInput: CreateProjectInput
  ): Promise<Projects> {
    return this.projectsService.create(createProjectInput);
  }

  /**
   * GraphQL Mutation: Update an existing project
   * 
   * SECURITY: Requires authentication + ADMIN role
   * Only authenticated admins can modify projects
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Projects, {
    description: 'Update an existing project (ADMIN only)'
  })
  async updateProject(
    @Args('id') id: string,
    @Args('input') updateProjectInput: UpdateProjectInput
  ): Promise<Projects> {
    return this.projectsService.update(id, updateProjectInput);
  }

  /**
   * GraphQL Mutation: Delete a project
   * 
   * SECURITY: Requires authentication + ADMIN role
   * Only authenticated admins can delete projects
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean, {
    description: 'Delete a project (ADMIN only)'
  })
  async deleteProject(@Args('id') id: string): Promise<boolean> {
    return this.projectsService.remove(id);
  }

  /**
   * GraphQL Query: Get all images for a project
   * Query: { projectImages(projectId: "uuid") { id url public_id filename } }
   */
  @Query(() => [Image], {
    name: 'projectImages',
    description: 'Get all images for a specific project'
  })
  async getProjectImages(@Args('projectId') projectId: string): Promise<Image[]> {
    return this.projectsService.getProjectImages(projectId);
  }

  /**
   * GraphQL Mutation: Delete a project image
   * 
   * SECURITY: Requires authentication + ADMIN role
   * Only authenticated admins can delete project images
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Projects, {
    description: 'Delete a specific image from a project (ADMIN only)'
  })
  async deleteProjectImage(
    @Args('projectId') projectId: string,
    @Args('imageId') imageId: string
  ): Promise<Projects> {
    return this.projectsService.deleteProjectImage(projectId, imageId);
  }
}