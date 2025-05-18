/*
  # Add admin policies and utility functions
  
  1. New Policies
    - Add policies to allow admins to insert and delete users
    
  2. New Functions
    - Create utility functions for checking admin status and getting user roles
    
  3. Notes
    - Policies are created using DO blocks to check if they already exist
    - Functions are created with OR REPLACE to ensure they're updated
*/

-- Add policy to allow admins to insert new users using DO block to check if it exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Admins can insert users'
  ) THEN
    CREATE POLICY "Admins can insert users" ON auth_users
      FOR INSERT 
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM auth_users
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Add policy to allow admins to delete users using DO block to check if it exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Admins can delete users'
  ) THEN
    CREATE POLICY "Admins can delete users" ON auth_users
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM auth_users
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth_users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM auth_users WHERE id = auth.uid();
  RETURN COALESCE(user_role, 'anonymous');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;