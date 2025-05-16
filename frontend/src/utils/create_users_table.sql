-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  business_description TEXT,
  industry TEXT,
  website TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on auth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own data
CREATE POLICY users_policy_select ON users 
  FOR SELECT USING (auth.uid()::text = auth_id::text);

-- Policy for users to insert their own data
CREATE POLICY users_policy_insert ON users 
  FOR INSERT WITH CHECK (auth.uid()::text = auth_id::text);

-- Policy for users to update their own data
CREATE POLICY users_policy_update ON users 
  FOR UPDATE USING (auth.uid()::text = auth_id::text);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
