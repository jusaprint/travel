/*
  # Update cms_media table to support external storage providers
  
  1. Changes
    - Add storage_provider field to metadata
    - Add folder field to metadata
    - Add external_id field to metadata
    
  2. Notes
    - This allows tracking files stored in external services like Netlify
    - Maintains backward compatibility with existing records
*/

-- Update the cms_media table to support external storage providers
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cms_media'
    ) THEN
        -- Add default metadata to existing records if metadata is null
        UPDATE cms_media
        SET metadata = '{"storage_provider": "supabase", "folder": "uploads"}'::jsonb
        WHERE metadata IS NULL;
    END IF;
END $$;