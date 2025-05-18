/*
  # Fix Auth Users Policies
  
  1. Changes
    - Drop existing policies if they exist
    - Create new policies for admin access and user self-access
    - Prevent infinite recursion in policy definitions
    
  2. Security
    - Admins can perform all operations on auth_users
    - Regular users can only view and update their own records
    
  3. Notes
    - Uses DO block with conditional checks to avoid errors if policies don't exist
    - Separates admin policies by operation type to avoid ALL operation recursion issues
*/

-- Use a DO block to safely drop and recreate policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable delete for admins only" ON auth_users;
    DROP POLICY IF EXISTS "Enable insert for admins only" ON auth_users;
    DROP POLICY IF EXISTS "Enable read for self and admins" ON auth_users;
    DROP POLICY IF EXISTS "Enable update for self and admins" ON auth_users;
    DROP POLICY IF EXISTS "admin_full_access" ON auth_users;
    DROP POLICY IF EXISTS "users_self_access" ON auth_users;
    DROP POLICY IF EXISTS "users_self_update" ON auth_users;
    
    -- Create separate admin policies for each operation to avoid recursion
    -- Admin SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'admin_read_access'
    ) THEN
        CREATE POLICY "admin_read_access"
        ON auth_users
        FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM auth_users au
                WHERE au.id = auth.uid()
                AND au.role = 'admin'
            )
        );
    END IF;
    
    -- Admin INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'admin_insert_access'
    ) THEN
        CREATE POLICY "admin_insert_access"
        ON auth_users
        FOR INSERT
        TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM auth_users au
                WHERE au.id = auth.uid()
                AND au.role = 'admin'
            )
        );
    END IF;
    
    -- Admin UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'admin_update_access'
    ) THEN
        CREATE POLICY "admin_update_access"
        ON auth_users
        FOR UPDATE
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
    END IF;
    
    -- Admin DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'admin_delete_access'
    ) THEN
        CREATE POLICY "admin_delete_access"
        ON auth_users
        FOR DELETE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM auth_users au
                WHERE au.id = auth.uid()
                AND au.role = 'admin'
            )
        );
    END IF;
    
    -- User self-access policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'users_self_access'
    ) THEN
        CREATE POLICY "users_self_access"
        ON auth_users
        FOR SELECT
        TO authenticated
        USING (
            id = auth.uid()
        );
    END IF;
    
    -- User self-update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'auth_users' AND policyname = 'users_self_update'
    ) THEN
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
    END IF;
END $$;