/*
  # Add explore_packages_url to cms_regions table

  1. Changes
    - Add `explore_packages_url` column to `cms_regions` table
      - Type: text
      - Nullable: true
      - Default: null

  2. Notes
    - The column is made nullable to avoid issues with existing records
    - No data migration is needed since this is a new optional column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cms_regions' 
    AND column_name = 'explore_packages_url'
  ) THEN
    ALTER TABLE cms_regions 
    ADD COLUMN explore_packages_url text DEFAULT NULL;
  END IF;
END $$;