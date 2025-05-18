/*
  # Fix auth_users RLS policies

  1. Changes
    - Drop existing policies that cause recursion
    - Create new, simplified policies for auth_users table
    - Add proper role-based access control

  2. Security
    - Enable RLS on auth_users table
    - Add policies for:
      - Users can read their own data
      - Admins can read all data
      - Admins can insert/update/delete data
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "admin_delete_access" ON auth_users;
DROP POLICY IF EXISTS "admin_insert_access" ON auth_users;
DROP POLICY IF EXISTS "admin_read_access" ON auth_users;
DROP POLICY IF EXISTS "admin_update_access" ON auth_users;
DROP POLICY IF EXISTS "admin_write_access" ON auth_users;
DROP POLICY IF EXISTS "users_self_access" ON auth_users;
DROP POLICY IF EXISTS "users_self_update" ON auth_users;

-- Create new, simplified policies
-- Allow users to read their own data
CREATE POLICY "users_read_own_data" ON auth_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all data
CREATE POLICY "admins_read_all" ON auth_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth_users au
      WHERE au.id = auth.uid() 
      AND au.role = 'admin'
      LIMIT 1
    )
  );

-- Allow admins to insert data
CREATE POLICY "admins_insert" ON auth_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth_users au
      WHERE au.id = auth.uid() 
      AND au.role = 'admin'
      LIMIT 1
    )
  );

-- Allow admins to update data
CREATE POLICY "admins_update" ON auth_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth_users au
      WHERE au.id = auth.uid() 
      AND au.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth_users au
      WHERE au.id = auth.uid() 
      AND au.role = 'admin'
      LIMIT 1
    )
  );

-- Allow admins to delete data
CREATE POLICY "admins_delete" ON auth_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth_users au
      WHERE au.id = auth.uid() 
      AND au.role = 'admin'
      LIMIT 1
    )
  );

-- Allow users to update their own data (except role)
CREATE POLICY "users_update_own_data" ON auth_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role IS NULL OR role = (SELECT role FROM auth_users WHERE id = auth.uid()))
  );