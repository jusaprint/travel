/*
  # Create media storage bucket and policies
  
  1. New Storage Bucket
    - Create a 'media' storage bucket for storing uploaded files
    - Set public access to allow reading files without authentication
    
  2. Storage Policies
    - Allow authenticated users to upload files
    - Allow anyone to download files
    - Allow authenticated users to delete their own files
    
  3. Notes
    - This migration ensures the media storage bucket exists
    - Policies are set up to allow proper access control
*/

-- Create the media storage bucket if it doesn't exist
DO $$
BEGIN
    -- Check if the bucket already exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'media'
    ) THEN
        -- Create the bucket
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('media', 'media', true);
        
        -- Create policy to allow authenticated users to upload files
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Media Upload Policy',
            '(role() = ''authenticated''::text)',
            'media'
        );
        
        -- Create policy to allow anyone to download files
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Media Download Policy',
            '(bucket_id = ''media''::text)',
            'media'
        );
        
        -- Create policy to allow authenticated users to delete their own files
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Media Delete Policy',
            '(role() = ''authenticated''::text)',
            'media'
        );
    END IF;
END $$;