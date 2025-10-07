import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AboutMe } from '../../aboutMe/entities/aboutMe.entity';

@ObjectType()
@Entity('social_media')
export class SocialMedia {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // display name e.g., Twitter
    @Field()
    @Column({ type: 'varchar', length: 100 })
    name: string;

    // url to profile
    @Field()
    @Column({ type: 'varchar', length: 255 })
    link: string;

    // icon url or name
    @Field()
    @Column({ type: 'varchar', length: 255 })
    icon: string;

    // link back to aboutMe (many social links belong to one aboutMe)
    @Field(() => AboutMe)
    @ManyToOne(() => AboutMe, (about) => about.social, { onDelete: 'CASCADE' })
    @JoinColumn()
    aboutMe: AboutMe;

    // timestamps
    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}