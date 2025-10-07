import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Contributors } from './entities/contributors.entity';
import { ContributorsService } from './contributors.service';
import { CreateContributorInput } from './dto/create-contributor.input';
import { UpdateContributorInput } from './dto/update-contributor.input';

/**
 * ContributorsResolver handles GraphQL queries and mutations for contributors
 * This is the entry point for all contributor-related GraphQL operations
 */
@Resolver(() => Contributors)
export class ContributorsResolver {
  constructor(
    private readonly contributorsService: ContributorsService
  ) {}

  /**
   * GraphQL Query: Get all contributors
   * Query: { 
   *   contributors { 
   *     id name email github 
   *     projects { id name }
   *   } 
   * }
   */
  @Query(() => [Contributors], { 
    name: 'contributors',
    description: 'Get all contributors with their projects' 
  })
  async getAllContributors(): Promise<Contributors[]> {
    return this.contributorsService.findAll();
  }

  /**
   * GraphQL Query: Get a single contributor by ID
   * Query: { 
   *   contributor(id: "uuid") { 
   *     id name email github projects { name } 
   *   } 
   * }
   */
  @Query(() => Contributors, { 
    name: 'contributor',
    description: 'Get a single contributor by ID',
    nullable: true 
  })
  async getContributor(@Args('id') id: string): Promise<Contributors> {
    return this.contributorsService.findOne(id);
  }

  /**
   * GraphQL Mutation: Create a new contributor
   * Mutation: { 
   *   createContributor(input: { 
   *     name: "John Doe", 
   *     email: "john@example.com",
   *     github: "johndoe"
   *   }) {
   *     id name email github
   *   }
   * }
   */
  @Mutation(() => Contributors, {
    description: 'Create a new contributor'
  })
  async createContributor(
    @Args('input') createContributorInput: CreateContributorInput
  ): Promise<Contributors> {
    return this.contributorsService.create(createContributorInput);
  }

  /**
   * GraphQL Mutation: Update an existing contributor
   * Mutation: {
   *   updateContributor(id: "uuid", input: { 
   *     name: "Jane Doe",
   *     github: "janedoe"
   *   }) {
   *     id name email github
   *   }
   * }
   */
  @Mutation(() => Contributors, {
    description: 'Update an existing contributor'
  })
  async updateContributor(
    @Args('id') id: string,
    @Args('input') updateContributorInput: UpdateContributorInput
  ): Promise<Contributors> {
    return this.contributorsService.update(id, updateContributorInput);
  }

  /**
   * GraphQL Mutation: Delete a contributor
   * Mutation: { deleteContributor(id: "uuid") }
   */
  @Mutation(() => Boolean, {
    description: 'Delete a contributor'
  })
  async deleteContributor(@Args('id') id: string): Promise<boolean> {
    return this.contributorsService.remove(id);
  }
}