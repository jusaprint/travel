/*
  # User Management Schema
  
  1. New Tables
    - Create auth_users table to store additional user information
    - Link to Supabase auth.users table
    
  2. Security
    - Enable Row Level Security
    - Add policies for user access control
    
  3. Automation
    - Create trigger to automatically create user profile on signup
*/

-- Create auth_users table to store additional user information
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Check and create "Users can view own data" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Users can view own data'
  ) THEN
    CREATE POLICY "Users can view own data" ON auth_users
      FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Check and create "Users can update own data" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" ON auth_users
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Check and create "Admins can view all data" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Admins can view all data'
  ) THEN
    CREATE POLICY "Admins can view all data" ON auth_users
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM auth_users
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;

  -- Check and create "Admins can update all data" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' AND policyname = 'Admins can update all data'
  ) THEN
    CREATE POLICY "Admins can update all data" ON auth_users
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM auth_users
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.auth_users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create initial admin user if it doesn't exist
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  -- Check if admin user exists in auth_users
  SELECT EXISTS (
    SELECT 1 FROM auth_users WHERE email = 'admin@kudosim.com'
  ) INTO admin_exists;
  
  -- If admin doesn't exist, create it
  IF NOT admin_exists THEN
    -- Note: We can't directly insert into auth.users from here
    -- This is just a placeholder. You'll need to create the user
    -- through the Supabase dashboard or API
    RAISE NOTICE 'Admin user does not exist. Please create it manually.';
  END IF;
END $$;