import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AboutMe } from '../../aboutMe/entities/aboutMe.entity';

@Entity('social_media')
export class SocialMedia {
    // primary id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // display name e.g., Twitter
    @Column({ type: 'varchar', length: 100 })
    name: string;

    // url to profile
    @Column({ type: 'varchar', length: 255 })
    link: string;

    // icon url or name
    @Column({ type: 'varchar', length: 255 })
    icon: string;

    // link back to aboutMe (many social links belong to one aboutMe)
    @ManyToOne(() => AboutMe, (about) => about.social, { onDelete: 'CASCADE' })
    @JoinColumn()
    aboutMe: AboutMe;

    // timestamps
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}