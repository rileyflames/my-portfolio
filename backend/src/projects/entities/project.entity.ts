import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Tech } from 'src/technologies/entities/tech.entity'
import { Contributors } from 'src/contributors/entities/contributors.entity'


@Entity('projects')
export class Projects {
    // primary id
    @PrimaryGeneratedColumn('uuid')
    id: string

    // project name
    @Column()
    name: string

    // github link
    @Column()
    githubLink: string

    // optional live url
    @Column({ nullable: true })
    liveUrl?: string

    // enum progress (lowercase per spec)
    @Column({
        type: 'enum',
        enum: ['pending','in-progress','finished'],
        default: 'pending'
    })
    progress: 'pending' | 'in-progress' | 'finished'

    // optional image url
    @Column({ nullable: true })
    imageUrl?: string

    // description text
    @Column('text')
    description: string

    // technologies relation (many-to-many)
    @ManyToMany(() => Tech, { eager: true })
    @JoinTable()
    technologies: Tech[]

    // conveniences: array of technology ids (simple-array). Optional.
    // Keep in sync with the relation if you need only ids in some responses.
    @Column('simple-array', { nullable: true })
    technologyIds?: string[]

    // optional tags as simple array
    @Column('simple-array', { nullable: true })
    tags?: string[]

    // contributors relation (many-to-many). Project can have multiple contributors.
    @ManyToMany(() => Contributors, (contrib) => contrib.projects, { eager: true, nullable: true })
    @JoinTable()
    contributors?: Contributors[]

    // who created this project (many projects -> one user)
    @ManyToOne(() => User, (user) => user.createdProjects, { eager: true })
    @JoinColumn({ name: 'createdById' })
    createdBy: User

    // who last edited this project
    @ManyToOne(() => User, (user) => user.editedProjects, { eager: true, nullable: true })
    @JoinColumn({ name: 'editedById' })
    editedBy?: User

    // timestamps
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}