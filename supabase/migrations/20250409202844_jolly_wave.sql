/*
  # Add missing columns to cms_regions table
  
  1. New Columns
    - Add `starting_price` column to `cms_regions` table
      - Type: text
      - Nullable: true
      - Default: null
    - Add `explore_packages_url` column to `cms_regions` table
      - Type: text
      - Nullable: true
      - Default: null
      
  2. Security
    - No changes to RLS policies needed
    
  3. Changes
    - Both columns are made nullable to avoid issues with existing records
    - No data migration is needed since these are new optional columns
*/

DO $$ 
BEGIN
  -- Add starting_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cms_regions' 
    AND column_name = 'starting_price'
  ) THEN
    ALTER TABLE cms_regions 
    ADD COLUMN starting_price text DEFAULT NULL;
  END IF;

  -- Add explore_packages_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cms_regions' 
    AND column_name = 'explore_packages_url'
  ) THEN
    ALTER TABLE cms_regions 
    ADD COLUMN explore_packages_url text DEFAULT NULL;
  END IF;
END $$;