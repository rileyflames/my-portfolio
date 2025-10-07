import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, ID, Field, registerEnumType } from '@nestjs/graphql';

export enum TechLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

registerEnumType(TechLevel, {
    name: 'TechLevel',
    description: 'Skill level for a technology',
});

@ObjectType()
@Entity('tech')
export class Tech {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // technology name (unique)
    @Field()
    @Column({ unique: true })
    name: string;

    // icon url or name
    @Field()
    @Column()
    icon: string;

    // skill level
    @Field(() => TechLevel)
    @Column({ type: 'enum', enum: TechLevel })
    level: TechLevel;

    // timestamps
    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}