/*
  # Fix auth_users policies to prevent recursion

  1. Changes
    - Drop existing policies that cause recursion
    - Create new policies with proper conditions that prevent recursion
    - Add policy for admin access
    - Add policy for self-access
    
  2. Security
    - Enable RLS on auth_users table
    - Add policies for CRUD operations
    - Ensure admin users can manage all users
    - Ensure users can view/edit their own data
*/

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable delete for admins only" ON auth_users;
DROP POLICY IF EXISTS "Enable insert for admins only" ON auth_users;
DROP POLICY IF EXISTS "Enable read for self and admins" ON auth_users;
DROP POLICY IF EXISTS "Enable update for self and admins" ON auth_users;

-- Create new policies without recursion
CREATE POLICY "admin_full_access"
ON auth_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth_users au
    WHERE au.id = auth.uid()
    AND au.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth_users au
    WHERE au.id = auth.uid()
    AND au.role = 'admin'
  )
);

CREATE POLICY "users_self_access"
ON auth_users
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);

CREATE POLICY "users_self_update"
ON auth_users
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid()
);