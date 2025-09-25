import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Projects } from 'src/projects/entities/project.entity'

@Entity('users')
export class User {
    // primary uuid id
    @PrimaryGeneratedColumn('uuid')
    id: string

    // user's full name
    @Column()
    name: string

    // unique email
    @Column({ unique: true })
    email: string

    // role enum
    @Column({
        type: 'enum',
        enum: ['ADMIN', 'EDITOR'],
        default: 'EDITOR'
    })
    role: 'ADMIN' | 'EDITOR'

    // password hash
    @Column()
    password: string

    // projects created by this user
    @OneToMany(() => Projects, (project) => project.createdBy)
    createdProjects: Projects[]

    // projects edited by this user
    @OneToMany(() => Projects, (project) => project.editedBy)
    editedProjects: Projects[]

    // timestamps
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}