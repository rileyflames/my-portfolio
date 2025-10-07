import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { TechnologiesService } from '../technologies/technologies.service';
import { UserService } from '../users/user.service';
import { Tech } from '../technologies/entities/tech.entity';
import { User } from '../users/entities/user.entity';

/**
 * ProjectsService handles all project-related business logic
 * This service manages CRUD operations for portfolio projects
 */
@Injectable()
export class ProjectsService {
  constructor(
    // Inject the TypeORM repository for the Projects entity
    @InjectRepository(Projects)
    private readonly projectsRepository: Repository<Projects>,
    
    // Inject other services we depend on
    private readonly technologiesService: TechnologiesService,
    private readonly userService: UserService,
  ) {}

  /**
   * Retrieves all projects from the database with related data
   * @returns Promise<Projects[]> - Array of all projects with relations
   */
  async findAll(): Promise<Projects[]> {
    return this.projectsRepository.find({
      // Load related entities automatically
      relations: ['technologies', 'contributors', 'createdBy', 'editedBy'],
      // Order by creation date (newest first)
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Finds a single project by its ID with all relations
   * @param id - The project's unique identifier
   * @returns Promise<Projects> - The project object with relations
   * @throws NotFoundException if project doesn't exist
   */
  async findOne(id: string): Promise<Projects> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      // Load all related entities
      relations: ['technologies', 'contributors', 'createdBy', 'editedBy']
    });
    
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    
    return project;
  }

  /**
   * Creates a new project in the database
   * @param createProjectInput - Project data from GraphQL input
   * @returns Promise<Projects> - The created project object
   * @throws NotFoundException if creator or technologies don't exist
   */
  async create(createProjectInput: CreateProjectInput): Promise<Projects> {
    // Verify that the creator exists
    const creator = await this.userService.findOne(createProjectInput.createdById);
    
    // Load technologies if provided
    let technologies: Tech[] = [];
    if (createProjectInput.technologyIds && createProjectInput.technologyIds.length > 0) {
      technologies = await this.technologiesService.findByIds(createProjectInput.technologyIds);
      
      // Check if all requested technologies were found
      if (technologies.length !== createProjectInput.technologyIds.length) {
        throw new NotFoundException('One or more technologies not found');
      }
    }

    // Create the project object
    const newProject = this.projectsRepository.create({
      name: createProjectInput.name,
      githubLink: createProjectInput.githubLink,
      liveUrl: createProjectInput.liveUrl,
      progress: createProjectInput.progress,
      imageUrl: createProjectInput.imageUrl,
      description: createProjectInput.description,
      technologyIds: createProjectInput.technologyIds,
      tags: createProjectInput.tags,
      createdBy: creator,
      technologies: technologies,
      // Note: contributors will be handled separately if needed
    });

    // Save the project to the database
    const savedProject = await this.projectsRepository.save(newProject);
    
    // Return the project with all relations loaded
    return this.findOne(savedProject.id);
  }

  /**
   * Updates an existing project's information
   * @param id - The project's ID to update
   * @param updateProjectInput - Updated project data
   * @returns Promise<Projects> - Updated project object
   * @throws NotFoundException if project, editor, or technologies don't exist
   */
  async update(id: string, updateProjectInput: UpdateProjectInput): Promise<Projects> {
    // First, find the existing project
    const project = await this.findOne(id); // This will throw NotFoundException if not found

    // If editor is specified, verify they exist
    let editor: User | null = null;
    if (updateProjectInput.editedById) {
      editor = await this.userService.findOne(updateProjectInput.editedById);
    }

    // Load new technologies if provided
    let technologies = project.technologies; // Keep existing technologies by default
    if (updateProjectInput.technologyIds !== undefined) {
      if (updateProjectInput.technologyIds.length > 0) {
        technologies = await this.technologiesService.findByIds(updateProjectInput.technologyIds);
        
        // Check if all requested technologies were found
        if (technologies.length !== updateProjectInput.technologyIds.length) {
          throw new NotFoundException('One or more technologies not found');
        }
      } else {
        technologies = []; // Clear technologies if empty array provided
      }
    }

    // Update the project properties
    Object.assign(project, {
      name: updateProjectInput.name ?? project.name,
      githubLink: updateProjectInput.githubLink ?? project.githubLink,
      liveUrl: updateProjectInput.liveUrl ?? project.liveUrl,
      progress: updateProjectInput.progress ?? project.progress,
      imageUrl: updateProjectInput.imageUrl ?? project.imageUrl,
      description: updateProjectInput.description ?? project.description,
      technologyIds: updateProjectInput.technologyIds ?? project.technologyIds,
      tags: updateProjectInput.tags ?? project.tags,
      technologies: technologies,
      editedBy: editor ?? project.editedBy,
    });

    // Save the updated project
    await this.projectsRepository.save(project);
    
    // Return the updated project with all relations
    return this.findOne(id);
  }

  /**
   * Deletes a project from the database
   * @param id - The project's ID to delete
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if project doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // First check if the project exists
    await this.findOne(id); // This will throw NotFoundException if not found

    // Delete the project
    const result = await this.projectsRepository.delete(id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Finds projects by creator
   * @param creatorId - The creator's user ID
   * @returns Promise<Projects[]> - Array of projects created by the user
   */
  async findByCreator(creatorId: string): Promise<Projects[]> {
    return this.projectsRepository.find({
      where: { createdBy: { id: creatorId } },
      relations: ['technologies', 'contributors', 'createdBy', 'editedBy'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Finds projects by progress status
   * @param progress - The progress status to filter by
   * @returns Promise<Projects[]> - Array of projects with the specified status
   */
  async findByProgress(progress: 'pending' | 'in-progress' | 'finished'): Promise<Projects[]> {
    return this.projectsRepository.find({
      where: { progress },
      relations: ['technologies', 'contributors', 'createdBy', 'editedBy'],
      order: { createdAt: 'DESC' }
    });
  }
}