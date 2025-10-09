import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCategoryToTech20251008133805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add category column with default value 'language'
    await queryRunner.addColumn(
      'tech',
      new TableColumn({
        name: 'category',
        type: 'enum',
        enum: ['language', 'framework', 'devops'],
        default: "'language'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove category column
    await queryRunner.dropColumn('tech', 'category');
  }
}
