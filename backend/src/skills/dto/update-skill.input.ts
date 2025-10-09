import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { SkillLevel, SkillCategory } from '../entities/skill.entity';

/**
 * Input type for updating an existing skill
 * All fields are optional since we might only want to update specific fields
 */
@InputType()
export class UpdateSkillInput {
  // Skill name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Skill name cannot be empty' })
  name?: string;

  // Icon URL or identifier (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Icon cannot be empty' })
  icon?: string;

  // Skill level (optional for updates)
  @Field(() => SkillLevel, { nullable: true })
  @IsOptional()
  @IsEnum(SkillLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level?: SkillLevel;

  // Category (optional for updates)
  @Field(() => SkillCategory, { nullable: true })
  @IsOptional()
  @IsEnum(SkillCategory, { message: 'Category must be languages, frameworks, devops, databases, tools, or ui_design' })
  category?: SkillCategory;
}
