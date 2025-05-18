/*
  # Add status column to testimonials table

  1. Changes
    - Add `status` column to `cms_testimonials` table with default value 'pending'
    - Set existing rows to 'approved' status
    - Add check constraint to ensure valid status values

  2. Security
    - No changes to RLS policies needed
*/

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_testimonials' AND column_name = 'status'
  ) THEN
    ALTER TABLE cms_testimonials 
    ADD COLUMN status text NOT NULL DEFAULT 'pending';

    -- Update existing testimonials to 'approved' status
    UPDATE cms_testimonials SET status = 'approved';

    -- Add check constraint for valid status values
    ALTER TABLE cms_testimonials
    ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;