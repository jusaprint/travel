-- First, drop existing policies to avoid conflicts
DO $$
BEGIN
  -- Drop all existing policies on auth_users
  DROP POLICY IF EXISTS "admin_delete_access" ON auth_users;
  DROP POLICY IF EXISTS "admin_full_access" ON auth_users;
  DROP POLICY IF EXISTS "admin_insert_access" ON auth_users;
  DROP POLICY IF EXISTS "admin_read_access" ON auth_users;
  DROP POLICY IF EXISTS "admin_update_access" ON auth_users;
  DROP POLICY IF EXISTS "admin_write_access" ON auth_users;
  DROP POLICY IF EXISTS "admins_delete" ON auth_users;
  DROP POLICY IF EXISTS "admins_insert" ON auth_users;
  DROP POLICY IF EXISTS "admins_read_all" ON auth_users;
  DROP POLICY IF EXISTS "admins_update" ON auth_users;
  DROP POLICY IF EXISTS "users_read_own_data" ON auth_users;
  DROP POLICY IF EXISTS "users_self_access" ON auth_users;
  DROP POLICY IF EXISTS "users_self_update" ON auth_users;
  DROP POLICY IF EXISTS "users_update_own_data" ON auth_users;
  DROP POLICY IF EXISTS "Enable delete for admins only" ON auth_users;
  DROP POLICY IF EXISTS "Enable insert for admins only" ON auth_users;
  DROP POLICY IF EXISTS "Enable read for self and admins" ON auth_users;
  DROP POLICY IF EXISTS "Enable update for self and admins" ON auth_users;
END $$;

-- Create new policies with fixed approach
CREATE POLICY "user_read_self"
ON auth_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "user_update_self"
ON auth_users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create admin policies using a subquery approach to avoid recursion
CREATE POLICY "admin_read_all"
ON auth_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN auth_users ON auth.users.id = auth_users.id
    WHERE auth.users.id = auth.uid() AND auth_users.role = 'admin'
  )
);

CREATE POLICY "admin_insert"
ON auth_users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN auth_users ON auth.users.id = auth_users.id
    WHERE auth.users.id = auth.uid() AND auth_users.role = 'admin'
  )
);

CREATE POLICY "admin_update_all"
ON auth_users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN auth_users ON auth.users.id = auth_users.id
    WHERE auth.users.id = auth.uid() AND auth_users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN auth_users ON auth.users.id = auth_users.id
    WHERE auth.users.id = auth.uid() AND auth_users.role = 'admin'
  )
);

CREATE POLICY "admin_delete_all"
ON auth_users
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    JOIN auth_users ON auth.users.id = auth_users.id
    WHERE auth.users.id = auth.uid() AND auth_users.role = 'admin'
  )
);