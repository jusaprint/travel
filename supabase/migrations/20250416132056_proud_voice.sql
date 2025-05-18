/*
  # Create media folders structure
  
  1. Folder Structure
    - Create standard folders for organizing media files
    - Includes: images, uploads, countries, logos, backgrounds, icons
    
  2. Notes
    - This migration ensures a consistent folder structure
    - Helps organize media by purpose and type
*/

-- Create standard folders in the media bucket
DO $$
BEGIN
    -- Create the folders
    PERFORM storage.create_object('media', 'images/', '');
    PERFORM storage.create_object('media', 'uploads/', '');
    PERFORM storage.create_object('media', 'countries/', '');
    PERFORM storage.create_object('media', 'logos/', '');
    PERFORM storage.create_object('media', 'backgrounds/', '');
    PERFORM storage.create_object('media', 'icons/', '');
    PERFORM storage.create_object('media', 'popup/', '');
    PERFORM storage.create_object('media', 'hero/', '');
    PERFORM storage.create_object('media', 'app-download/', '');
    PERFORM storage.create_object('media', 'testimonials/', '');
EXCEPTION
    -- Ignore errors if folders already exist
    WHEN OTHERS THEN
        NULL;
END $$;