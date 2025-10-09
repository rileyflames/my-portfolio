import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to expand skill categories from 3 to 6
 * 
 * Old categories: language, framework, devops
 * New categories: languages, frameworks, devops, databases, tools, ui_design
 * 
 * This migration:
 * 1. Updates existing data (language → languages, framework → frameworks)
 * 2. Alters the enum to include new categories
 */
export class UpdateSkillCategories20250109000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Update existing data to use new category names
    await queryRunner.query(`
      UPDATE tech 
      SET category = 'languages' 
      WHERE category = 'language'
    `);

    await queryRunner.query(`
      UPDATE tech 
      SET category = 'frameworks' 
      WHERE category = 'framework'
    `);

    // Step 2: Drop the old enum type and create a new one with all 6 categories
    // Note: PostgreSQL requires us to alter the column type
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category TYPE VARCHAR(50)
    `);

    // Step 3: Create new enum type with all 6 categories
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE skill_category_enum AS ENUM (
          'languages',
          'frameworks', 
          'devops',
          'databases',
          'tools',
          'ui_design'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Step 4: Convert column back to enum with new type
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category TYPE skill_category_enum 
      USING category::skill_category_enum
    `);

    // Step 5: Set default value
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category SET DEFAULT 'languages'::skill_category_enum
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to old 3 categories
    
    // Step 1: Update data back to old names
    await queryRunner.query(`
      UPDATE tech 
      SET category = 'language' 
      WHERE category = 'languages'
    `);

    await queryRunner.query(`
      UPDATE tech 
      SET category = 'framework' 
      WHERE category = 'frameworks'
    `);

    // Step 2: Update any new categories to a default (devops)
    await queryRunner.query(`
      UPDATE tech 
      SET category = 'devops' 
      WHERE category IN ('databases', 'tools', 'ui_design')
    `);

    // Step 3: Convert to varchar temporarily
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category TYPE VARCHAR(50)
    `);

    // Step 4: Drop new enum type
    await queryRunner.query(`
      DROP TYPE IF EXISTS skill_category_enum
    `);

    // Step 5: Create old enum type
    await queryRunner.query(`
      CREATE TYPE tech_category_enum AS ENUM ('language', 'framework', 'devops')
    `);

    // Step 6: Convert back to old enum
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category TYPE tech_category_enum 
      USING category::tech_category_enum
    `);

    // Step 7: Set old default
    await queryRunner.query(`
      ALTER TABLE tech 
      ALTER COLUMN category SET DEFAULT 'language'::tech_category_enum
    `);
  }
}
