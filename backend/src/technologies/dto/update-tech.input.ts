import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { TechLevel } from '../entities/tech.entity';

/**
 * Input type for updating an existing technology
 * All fields are optional since you might only want to update specific properties
 */
@InputType()
export class UpdateTechInput {
  // The technology's name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Technology name cannot be empty' })
  name?: string;

  // Icon URL or icon name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Icon cannot be empty' })
  icon?: string;

  // Skill level (optional for updates)
  @Field(() => TechLevel, { nullable: true })
  @IsOptional()
  @IsEnum(TechLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level?: TechLevel;
}: string;

  // Skill level (optional for updates)
  @Field(() => TechLevel, { nullable: true })
  @IsOptional()
  @IsEnum(TechLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level?: TechLevel;
}