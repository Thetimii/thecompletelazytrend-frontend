-- Complete SQL for users table with all existing fields plus new ones
-- This can be pasted directly into the Supabase SQL editor to replace the existing table definition

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists (this will recreate it with all fields)
DROP TABLE IF EXISTS users;

-- Create users table with all fields
CREATE TABLE users (
  -- Existing fields
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  business_description TEXT,
  weekly_time_commitment INTEGER,
  social_media_experience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_notifications BOOLEAN DEFAULT TRUE,
  email_time_hour INTEGER DEFAULT 9,
  email_time_minute INTEGER DEFAULT 0,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  is_subscribed BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  trial_end_date TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  
  -- New fields for onboarding
  auth_id UUID UNIQUE,  -- Link to Supabase Auth user ID
  full_name TEXT,
  business_name TEXT,
  industry TEXT,
  website TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on auth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own data
CREATE POLICY users_policy_select ON users 
  FOR SELECT USING (auth.uid()::text = auth_id::text OR auth_id IS NULL);

-- Policy for users to insert their own data
CREATE POLICY users_policy_insert ON users 
  FOR INSERT WITH CHECK (auth.uid()::text = auth_id::text OR auth_id IS NULL);

-- Policy for users to update their own data
CREATE POLICY users_policy_update ON users 
  FOR UPDATE USING (auth.uid()::text = auth_id::text OR auth_id IS NULL);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
