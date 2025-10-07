import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Projects } from 'src/projects/entities/project.entity'
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

// Define user roles as an enum for type safety
export enum UserRole {
    ADMIN = 'ADMIN',     // Full access to all features
    EDITOR = 'EDITOR',   // Can create and edit content
}

// Register the enum with GraphQL so it can be used in the schema
registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'User role determining access permissions',
});

/**
 * User entity represents a user in the system
 * @ObjectType() - Makes this class available in GraphQL schema
 * @Entity('users') - Creates a 'users' table in PostgreSQL
 */
@ObjectType()
@Entity('users')
export class User {
    // Primary key - unique identifier for each user
    @Field(() => ID) // Expose as ID type in GraphQL
    @PrimaryGeneratedColumn('uuid') // Auto-generate UUID in database
    id: string

    // User's display name
    @Field() // Expose in GraphQL schema
    @Column() // Store as regular column in database
    name: string

    // User's email address (must be unique)
    @Field() // Expose in GraphQL schema
    @Column({ unique: true }) // Unique constraint in database
    email: string

    // User's role (ADMIN or EDITOR)
    @Field(() => UserRole) // Expose as UserRole enum in GraphQL
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EDITOR // New users default to EDITOR role
    })
    role: UserRole

    // User's password hash - NOT exposed in GraphQL for security
    // Notice there's no @Field() decorator here
    @Column()
    password: string

    // One-to-many relationship: One user can create many projects
    @Field(() => [Projects], { nullable: true }) // Array of projects in GraphQL
    @OneToMany(() => Projects, (project) => project.createdBy)
    createdProjects: Projects[]

    // One-to-many relationship: One user can edit many projects
    @Field(() => [Projects], { nullable: true }) // Array of projects in GraphQL
    @OneToMany(() => Projects, (project) => project.editedBy)
    editedProjects: Projects[]

    // Automatically set when user is created
    @Field(() => Date) // Expose as Date type in GraphQL
    @CreateDateColumn() // Auto-set creation timestamp
    createdAt: Date

    // Automatically updated when user is modified
    @Field(() => Date) // Expose as Date type in GraphQL
    @UpdateDateColumn() // Auto-update modification timestamp
    updatedAt: Date
}