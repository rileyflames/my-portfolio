import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Projects } from '../../projects/entities/project.entity';

@ObjectType()
@Entity('contributors')
export class Contributors {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // contributor name
    @Field()
    @Column()
    name: string;

    // unique email
    @Field()
    @Column({ unique: true })
    email: string;

    // unique github username or url
    @Field()
    @Column({ unique: true })
    github: string;

    // many-to-many to projects
    @Field(() => [Projects])
    @ManyToMany(() => Projects, project => project.contributors)
    projects: Projects[];
}