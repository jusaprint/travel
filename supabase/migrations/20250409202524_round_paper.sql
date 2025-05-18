/*
  # Add starting price to regions table

  1. Changes
    - Add `starting_price` column to `cms_regions` table
      - Type: text
      - Nullable: true
      - Default: null
      - Purpose: Store the starting price for packages in a region

  2. Notes
    - Column is made nullable to maintain compatibility with existing records
    - Text type chosen to allow flexible price formatting
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cms_regions' 
    AND column_name = 'starting_price'
  ) THEN
    ALTER TABLE cms_regions 
    ADD COLUMN starting_price text DEFAULT NULL;
  END IF;
END $$;