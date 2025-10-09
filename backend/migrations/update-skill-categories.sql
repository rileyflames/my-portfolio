-- Migration: Update Skill Categories from 3 to 6
-- Date: 2025-01-09
-- Description: Expands skill categories and updates existing data

-- Step 1: Update existing data to use new category names
UPDATE tech 
SET category = 'languages' 
WHERE category = 'language';

UPDATE tech 
SET category = 'frameworks' 
WHERE category = 'framework';

-- Step 2: Alter the enum type to include new categories
-- PostgreSQL requires us to add new values to the enum one at a time
ALTER TYPE "tech_category_enum" RENAME TO "tech_category_enum_old";

-- Step 3: Create new enum with all 6 categories
CREATE TYPE "tech_category_enum" AS ENUM (
  'languages',
  'frameworks',
  'devops',
  'databases',
  'tools',
  'ui_design'
);

-- Step 4: Update the column to use the new enum
ALTER TABLE tech 
  ALTER COLUMN category TYPE "tech_category_enum" 
  USING category::text::"tech_category_enum";

-- Step 5: Drop the old enum
DROP TYPE "tech_category_enum_old";

-- Step 6: Update the default value
ALTER TABLE tech 
  ALTER COLUMN category SET DEFAULT 'languages'::"tech_category_enum";

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  udt_name,
  column_default
FROM information_schema.columns 
WHERE table_name = 'tech' AND column_name = 'category';

-- Show current data
SELECT id, name, category FROM tech ORDER BY category, name;
