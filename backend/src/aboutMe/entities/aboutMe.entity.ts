import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Tech } from '../../technologies/entities/tech.entity';
import { SocialMedia } from '../../socialMedia/entities/socialMedia.entity';

@Entity('about_me')
export class AboutMe {
    // primary id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // full name
    @Column()
    fullName: string;

    // date of birth (ISO string)
    @Column()
    dob: string;

    // when started coding (ISO string)
    @Column()
    startedCoding: string;

    // biography text
    @Column('text')
    bio: string;

    // many-to-many relation to technologies (joined table)
    @ManyToMany(() => Tech, { eager: true })
    @JoinTable()
    technologies: Tech[];

    // one-to-many relation to social links
    @OneToMany(() => SocialMedia, (social) => social.aboutMe, { eager: true })
    social: SocialMedia[];

    // optional profile image url
    @Column({ nullable: true })
    imageUrl?: string;

    // timestamps
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}