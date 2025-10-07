import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Projects } from 'src/projects/entities/project.entity'
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

export enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
}

registerEnumType(UserRole, {
    name: 'UserRole',
})

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column()
    name: string

    @Field()
    @Column({ unique: true })
    email: string

    @Field(() => UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EDITOR
    })
    role: UserRole

    @Field()
    @Column()
    password: string

    @Field(() => [Projects], { nullable: true })
    @OneToMany(() => Projects, (project) => project.createdBy)
    createdProjects: Projects[]

    @Field(() => [Projects], { nullable: true })
    @OneToMany(() => Projects, (project) => project.editedBy)
    editedProjects: Projects[]

    @Field(()=> Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(()=> Date)
    @UpdateDateColumn()
    updatedAt: Date
}