import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity'
import { Skill } from 'src/skills/entities/skill.entity'
import { Contributors } from 'src/contributors/entities/contributors.entity'


@ObjectType()
@Entity('projects')
export class Projects {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    // project name
    @Field()
    @Column()
    name: string

    // github link
    @Field()
    @Column()
    githubLink: string

    // optional live url
    @Field({ nullable: true })
    @Column({ nullable: true })
    liveUrl?: string

    // enum progress (lowercase per spec)
    @Field()
    @Column({
        type: 'enum',
        enum: ['pending','in-progress','finished'],
        default: 'pending'
    })
    progress: 'pending' | 'in-progress' | 'finished'

    // optional image url (main/featured image)
    @Field({ nullable: true })
    @Column({ nullable: true })
    imageUrl?: string

    // multiple project images (gallery)
    @Field(() => [String], { nullable: true })
    @Column('simple-array', { nullable: true })
    images?: string[]

    // description text
    @Field()
    @Column('text')
    description: string

    // skills relation (many-to-many)
    @Field(() => [Skill])
    @ManyToMany(() => Skill, { eager: true })
    @JoinTable()
    technologies: Skill[]

    // conveniences: array of technology ids (simple-array). Optional.
    // Keep in sync with the relation if you need only ids in some responses.
    @Field(() => [String], { nullable: true })
    @Column('simple-array', { nullable: true })
    technologyIds?: string[]

    // optional tags as simple array
    @Field(() => [String], { nullable: true })
    @Column('simple-array', { nullable: true })
    tags?: string[]

    // contributors relation (many-to-many). Project can have multiple contributors.
    @Field(() => [Contributors], { nullable: true })
    @ManyToMany(() => Contributors, (contrib) => contrib.projects, { eager: true, nullable: true })
    @JoinTable()
    contributors?: Contributors[]

    // who created this project (many projects -> one user)
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.createdProjects, { eager: true })
    @JoinColumn({ name: 'createdById' })
    createdBy: User

    // who last edited this project
    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.editedProjects, { eager: true, nullable: true })
    @JoinColumn({ name: 'editedById' })
    editedBy?: User

    // timestamps
    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

}