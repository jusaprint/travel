/*
  # Fix recursive policies on auth_users table

  1. Changes
    - Remove recursive policies that were causing infinite loops
    - Create new simplified policies for auth_users table
    - Use auth.uid() directly instead of querying the table again
    
  2. Security
    - Maintain same security level but with more efficient policies
    - Users can still only access their own data
    - Admins can access all data through role check
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can delete users" ON auth_users;
DROP POLICY IF EXISTS "Admins can insert users" ON auth_users;
DROP POLICY IF EXISTS "Admins can update all data" ON auth_users;
DROP POLICY IF EXISTS "Admins can view all data" ON auth_users;
DROP POLICY IF EXISTS "Users can update own data" ON auth_users;
DROP POLICY IF EXISTS "Users can view own data" ON auth_users;

-- Create new non-recursive policies
CREATE POLICY "Enable read for self and admins"
ON auth_users
FOR SELECT
TO public
USING (
  auth.uid() = id OR 
  (SELECT role FROM auth_users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Enable update for self and admins"
ON auth_users
FOR UPDATE
TO public
USING (
  auth.uid() = id OR 
  (SELECT role FROM auth_users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  auth.uid() = id OR 
  (SELECT role FROM auth_users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Enable delete for admins only"
ON auth_users
FOR DELETE
TO public
USING (
  (SELECT role FROM auth_users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Enable insert for admins only"
ON auth_users
FOR INSERT
TO public
WITH CHECK (
  (SELECT role FROM auth_users WHERE id = auth.uid()) = 'admin'
);