import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, ID, Field, registerEnumType } from '@nestjs/graphql';

export enum SkillLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export enum SkillCategory {
    LANGUAGES = 'languages',
    FRAMEWORKS = 'frameworks',
    DEVOPS = 'devops',
    DATABASES = 'databases',
    TOOLS = 'tools',
    UI_DESIGN = 'ui_design',
}

registerEnumType(SkillLevel, {
    name: 'SkillLevel',
    description: 'Skill level for a technology',
});

registerEnumType(SkillCategory, {
    name: 'SkillCategory',
    description: 'Category of skill',
});

@ObjectType()
@Entity('tech') // Keep table name as 'tech' to avoid database migration
export class Skill {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // skill name (unique)
    @Field()
    @Column({ unique: true })
    name: string;

    // icon url or name
    @Field()
    @Column()
    icon: string;

    // skill level
    @Field(() => SkillLevel)
    @Column({ type: 'enum', enum: SkillLevel })
    level: SkillLevel;

    // category
    @Field(() => SkillCategory)
    @Column({ type: 'enum', enum: SkillCategory, default: SkillCategory.LANGUAGES })
    category: SkillCategory;

    // timestamps
    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}
