import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl, IsEnum } from 'class-validator';
import { TechLevel } from '../entities/tech.entity';

/**
 * Input type for creating a new technology
 * Used in GraphQL mutations to validate incoming data
 */
@InputType()
export class CreateTechnologyInput {
  // Technology name (e.g., "React", "Node.js", "TypeScript")
  @Field()
  @IsNotEmpty({ message: 'Technology name is required' })
  name: string;

  // Icon URL or icon name/identifier
  @Field()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  // Skill level for this technology
  @Field(() => TechLevel)
  @IsEnum(TechLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level: TechLevel;
}