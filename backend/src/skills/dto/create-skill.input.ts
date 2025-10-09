import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { SkillLevel, SkillCategory } from '../entities/skill.entity';

/**
 * Input type for creating a new skill
 * Used in GraphQL mutations to validate incoming data
 */
@InputType()
export class CreateSkillInput {
  // Skill name (e.g., "React", "Node.js", "TypeScript")
  @Field()
  @IsNotEmpty({ message: 'Skill name is required' })
  name: string;

  // Icon URL or icon name/identifier
  @Field()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  // Skill level
  @Field(() => SkillLevel)
  @IsEnum(SkillLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level: SkillLevel;

  // Category of skill
  @Field(() => SkillCategory)
  @IsEnum(SkillCategory, { message: 'Category must be languages, frameworks, devops, databases, tools, or ui_design' })
  category: SkillCategory;
}
