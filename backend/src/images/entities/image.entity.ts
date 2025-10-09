import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('images')
export class Image {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @Index('IDX_IMAGES_PUBLIC_ID')
  public_id: string;

  @Field()
  @Column({ type: 'text' })
  url: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  alt_text?: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  @Index('IDX_IMAGES_OWNER_ID')
  owner_id?: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  @Index('IDX_IMAGES_PROJECT_ID')
  project_id?: string;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
