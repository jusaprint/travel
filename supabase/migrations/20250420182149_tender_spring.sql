-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_full_access" ON auth_users;
DROP POLICY IF EXISTS "users_self_access" ON auth_users;
DROP POLICY IF EXISTS "users_self_update" ON auth_users;

-- Create new policies without recursion
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

CREATE POLICY "admin_write_access"
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