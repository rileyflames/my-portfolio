import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { SkillsService } from '../skills/skills.service';
import { UserService } from '../users/user.service';
import { Skill } from '../skills/entities/skill.entity';
import { User } from '../users/entities/user.entity';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';
import { ContributorsService } from '../contributors/contributors.service';
import { Contributors } from '../contributors/entities/contributors.entity';

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
    private readonly skillsService: SkillsService,
    private readonly userService: UserService,
    private readonly imagesService: ImagesService,
    private readonly contributorsService: ContributorsService,
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
    
    // Load skills if provided
    let technologies: Skill[] = [];
    if (createProjectInput.technologyIds && createProjectInput.technologyIds.length > 0) {
      technologies = await this.skillsService.findByIds(createProjectInput.technologyIds);
      
      // Check if all requested technologies were found
      if (technologies.length !== createProjectInput.technologyIds.length) {
        throw new NotFoundException('One or more technologies not found');
      }
    }

    // Load contributors if provided
    let contributors: Contributors[] = [];
    if (createProjectInput.contributorIds && createProjectInput.contributorIds.length > 0) {
      contributors = await this.contributorsService.findByIds(createProjectInput.contributorIds);
      
      // Check if all requested contributors were found
      if (contributors.length !== createProjectInput.contributorIds.length) {
        throw new NotFoundException('One or more contributors not found');
      }
    }

    // Create the project object
    const newProject = this.projectsRepository.create({
      name: createProjectInput.name,
      githubLink: createProjectInput.githubLink,
      liveUrl: createProjectInput.liveUrl,
      progress: createProjectInput.progress,
      imageUrl: createProjectInput.imageUrl,
      images: createProjectInput.images, // Handle images array
      description: createProjectInput.description,
      technologyIds: createProjectInput.technologyIds,
      tags: createProjectInput.tags,
      createdBy: creator,
      technologies: technologies,
      contributors: contributors,
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
      // Normalize null to empty array to avoid runtime errors when checking .length
      const ids = updateProjectInput.technologyIds ?? []
      if (ids.length > 0) {
        technologies = await this.skillsService.findByIds(ids);

        // Check if all requested technologies were found
        if (technologies.length !== ids.length) {
          throw new NotFoundException('One or more technologies not found');
        }
      } else {
        technologies = []; // Clear technologies if empty array or null provided
      }
    }

    // Load new contributors if provided
    let contributors = project.contributors; // Keep existing contributors by default
    if (updateProjectInput.contributorIds !== undefined) {
      const ids = updateProjectInput.contributorIds ?? []
      if (ids.length > 0) {
        contributors = await this.contributorsService.findByIds(ids);

        // Check if all requested contributors were found
        if (contributors.length !== ids.length) {
          throw new NotFoundException('One or more contributors not found');
        }
      } else {
        contributors = []; // Clear contributors if empty array or null provided
      }
    }

    // Update the project properties
    Object.assign(project, {
      name: updateProjectInput.name ?? project.name,
      githubLink: updateProjectInput.githubLink ?? project.githubLink,
      liveUrl: updateProjectInput.liveUrl ?? project.liveUrl,
      progress: updateProjectInput.progress ?? project.progress,
      imageUrl: updateProjectInput.imageUrl ?? project.imageUrl,
      images: updateProjectInput.images ?? project.images, // Handle images array
      description: updateProjectInput.description ?? project.description,
      technologyIds: updateProjectInput.technologyIds ?? project.technologyIds,
      tags: updateProjectInput.tags ?? project.tags,
      technologies: technologies,
      contributors: contributors,
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

  /**
   * Upload images to a project (up to 10 total)
   * @param projectId - The project ID
   * @param files - Array of uploaded files
   * @returns Promise<Projects> - Updated project with new images
   */
  async uploadProjectImages(projectId: string, files: Express.Multer.File[]): Promise<Projects> {
    const project = await this.findOne(projectId);

    // Get existing images for this project
    const existingImages = await this.imagesService.findImages({ projectId });
    const currentImageCount = existingImages.data.length;

    // Check if adding new images would exceed the limit
    if (currentImageCount + files.length > 10) {
      throw new BadRequestException(
        `Cannot upload ${files.length} images. Project already has ${currentImageCount} images. Maximum is 10.`
      );
    }

    // Upload all images
    const uploadedImages: Image[] = [];
    for (const file of files) {
      const image = await this.imagesService.uploadImage(file, {
        project_id: projectId,
        alt_text: `${project.name} project image`,
      });
      uploadedImages.push(image);
    }

    // Update project's images array with all image URLs
    const allImages = await this.imagesService.findImages({ projectId });
    project.images = allImages.data.map(img => img.url);
    await this.projectsRepository.save(project);

    return this.findOne(projectId);
  }

  /**
   * Delete a specific image from a project
   * @param projectId - The project ID
   * @param imageId - The image ID to delete
   * @returns Promise<Projects> - Updated project without the deleted image
   */
  async deleteProjectImage(projectId: string, imageId: string): Promise<Projects> {
    const project = await this.findOne(projectId);

    // Verify the image belongs to this project
    const image = await this.imagesService.findImages({ projectId });
    const imageToDelete = image.data.find(img => img.id === imageId);

    if (!imageToDelete) {
      throw new NotFoundException(`Image with ID ${imageId} not found for this project`);
    }

    // Delete the image (from both Cloudinary and database)
    await this.imagesService.deleteImage(imageId);

    // Update project's images array
    const remainingImages = await this.imagesService.findImages({ projectId });
    project.images = remainingImages.data.map(img => img.url);
    await this.projectsRepository.save(project);

    return this.findOne(projectId);
  }

  /**
   * Get all images for a project
   * @param projectId - The project ID
   * @returns Promise<Image[]> - Array of images for the project
   */
  async getProjectImages(projectId: string): Promise<Image[]> {
    await this.findOne(projectId); // Verify project exists
    const result = await this.imagesService.findImages({ projectId });
    return result.data;
  }
}