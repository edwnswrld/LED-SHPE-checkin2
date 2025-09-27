-- SHPE Check-in Hub - Database Permissions Setup
-- Run this SQL script in your Supabase SQL Editor to enable check-in functionality

-- Grant UPDATE permissions to anonymous role for volunteer check-ins
-- This allows the app to update checked_in status without authentication
GRANT UPDATE (checked_in, updated_at) ON volunteer_signups_led2025 TO anon;

-- Grant INSERT permissions for adding new walk-in volunteers
GRANT INSERT ON volunteer_signups_led2025 TO anon;

-- Enable Row Level Security for better security
ALTER TABLE volunteer_signups_led2025 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read volunteer records
CREATE POLICY "Allow anonymous reads" ON volunteer_signups_led2025
FOR SELECT TO anon
USING (true);

-- Create policy to allow anonymous users to update volunteer records
CREATE POLICY "Allow anonymous updates for check-in" ON volunteer_signups_led2025
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Create policy to allow anonymous users to insert new volunteers
CREATE POLICY "Allow anonymous inserts" ON volunteer_signups_led2025
FOR INSERT TO anon
WITH CHECK (true);

-- Verify the permissions were granted successfully
SELECT 
    schemaname,
    tablename,
    grantor,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'volunteer_signups_led2025' 
AND grantee = 'anon';

-- Success message
SELECT 'Permissions granted successfully! Your SHPE Check-in Hub is now ready to use.' as status;
