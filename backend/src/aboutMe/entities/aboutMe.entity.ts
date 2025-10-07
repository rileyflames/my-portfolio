import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tech } from '../../technologies/entities/tech.entity';
import { SocialMedia } from '../../socialMedia/entities/socialMedia.entity';

@ObjectType()
@Entity('about_me')
export class AboutMe {
    // primary id
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // full name
    @Field()
    @Column()
    fullName: string;

    // date of birth (ISO string)
    @Field()
    @Column()
    dob: string;

    // when started coding (ISO string)
    @Field()
    @Column()
    startedCoding: string;

    // biography text
    @Field()
    @Column('text')
    bio: string;

    // many-to-many relation to technologies (joined table)
    @Field(() => [Tech])
    @ManyToMany(() => Tech, { eager: true })
    @JoinTable()
    technologies: Tech[];

    // one-to-many relation to social links
    @Field(() => [SocialMedia])
    @OneToMany(() => SocialMedia, (social) => social.aboutMe, { eager: true })
    social: SocialMedia[];

    // optional profile image url
    @Field({ nullable: true })
    @Column({ nullable: true })
    imageUrl?: string;

    // timestamps

    @Field(()=> Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}