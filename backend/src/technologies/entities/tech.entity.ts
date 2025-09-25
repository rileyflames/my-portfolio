import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type TechLevel = 'beginner' | 'intermediate' | 'advanced';

@Entity('tech')
export class Tech {
    // primary id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // technology name (unique)
    @Column({ unique: true })
    name: string;

    // icon url or name
    @Column()
    icon: string;

    // skill level
    @Column({ type: 'enum', enum: ['beginner', 'intermediate', 'advanced'] })
    level: TechLevel;

    // timestamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}