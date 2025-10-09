import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateImagesTable1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'public_id',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: 'Cloudinary public_id for deletion',
          },
          {
            name: 'url',
            type: 'text',
            isNullable: false,
            comment: 'Full Cloudinary URL',
          },
          {
            name: 'filename',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'alt_text',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Optional: user who uploaded',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Optional: associated project',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for faster queries
    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'IDX_IMAGES_OWNER_ID',
        columnNames: ['owner_id'],
      }),
    );

    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'IDX_IMAGES_PROJECT_ID',
        columnNames: ['project_id'],
      }),
    );

    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'IDX_IMAGES_PUBLIC_ID',
        columnNames: ['public_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('images', 'IDX_IMAGES_PUBLIC_ID');
    await queryRunner.dropIndex('images', 'IDX_IMAGES_PROJECT_ID');
    await queryRunner.dropIndex('images', 'IDX_IMAGES_OWNER_ID');
    await queryRunner.dropTable('images');
  }
}
