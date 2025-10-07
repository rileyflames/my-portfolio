import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsUrl } from 'class-validator';
import { TechLevel } from '../entities/tech.entity';

/**
 * Input type for creating a new technology
 * This defines what data is required when adding a new technology
 */
@InputType()
export class CreateTechInput {
  // The technology's name (e.g., "React", "Node.js", "TypeScript")
  @Field()
  @IsNotEmpty({ message: 'Technology name is required' })
  name: string;

  // Icon URL or icon name for displaying the technology
  @Field()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  // Skill level for this technology
  @Field(() => TechLevel)
  @IsEnum(TechLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level: TechLevel;
} URL or icon name for displaying the technology
  @Field()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  // Skill level for this technology
  @Field(() => TechLevel)
  @IsEnum(TechLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level: TechLevel;
}