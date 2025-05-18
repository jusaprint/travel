/*
  # Set up authentication tables and policies
  
  1. New Tables
    - Create auth_users table to store additional user information
    - Link to Supabase auth.users table
    
  2. Security
    - Add RLS policies to restrict access to user data
    - Only allow users to see and modify their own data
    
  3. Changes
    - Create table for storing user profiles
    - Add policies for secure access
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

-- Create policy to allow users to see only their own data
CREATE POLICY "Users can view own data" ON auth_users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update only their own data
CREATE POLICY "Users can update own data" ON auth_users
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow admins to see all data
CREATE POLICY "Admins can view all data" ON auth_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth_users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy to allow admins to update all data
CREATE POLICY "Admins can update all data" ON auth_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth_users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.auth_users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create initial admin user if it doesn't exist
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  -- Check if admin user exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@kudosim.com'
  ) INTO admin_exists;
  
  -- If admin doesn't exist, create it
  IF NOT admin_exists THEN
    -- Note: We can't directly insert into auth.users from here
    -- This is just a placeholder. You'll need to create the user
    -- through the Supabase dashboard or API
    RAISE NOTICE 'Admin user does not exist. Please create it manually.';
  END IF;
END $$;