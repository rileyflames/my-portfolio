import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Projects } from '../../projects/entities/project.entity';

@Entity('contributors')
export class Contributors {
    // primary id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // contributor name
    @Column()
    name: string;

    // unique email
    @Column({ unique: true })
    email: string;

    // unique github username or url
    @Column({ unique: true })
    github: string;

    // many-to-many to projects
    @ManyToMany(() => Projects, project => project.contributors)
    projects: Projects[];
}