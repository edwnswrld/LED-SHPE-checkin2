# Supabase Setup for SHPE Check-in Hub

## 🎯 Overview

This guide explains how to configure your Supabase database to work properly with the SHPE Check-in Hub, including granting the necessary permissions for volunteer check-in functionality.

## 📋 Current Status

✅ **Database Connected**: Your app is successfully connected to Supabase  
✅ **Data Loading**: 51 volunteers are loading from the database  
❌ **Check-in Updates**: Anonymous role needs UPDATE permissions  

## 🔧 Required Database Permissions

For the check-in functionality to work, you need to grant UPDATE permissions to the anonymous role:

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `nwgidprevobilfnxansd`
3. Navigate to **SQL Editor** in the sidebar

### Step 2: Grant UPDATE Permissions

Run this SQL command to allow anonymous users to update check-in status:

```sql
-- Grant UPDATE permission to anonymous role for volunteer check-ins
GRANT UPDATE (checked_in, updated_at) ON volunteer_signups_led2025 TO anon;

-- Optional: Grant full UPDATE if you want team leaders to edit other fields
-- GRANT UPDATE ON volunteer_signups_led2025 TO anon;
```

### Step 3: Enable Row Level Security (Recommended)

For better security, enable RLS and create a policy:

```sql
-- Enable Row Level Security
ALTER TABLE volunteer_signups_led2025 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to update volunteer records
CREATE POLICY "Allow anonymous updates for check-in" ON volunteer_signups_led2025
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Create policy to allow anonymous users to read volunteer records  
CREATE POLICY "Allow anonymous reads" ON volunteer_signups_led2025
FOR SELECT TO anon
USING (true);

-- Create policy to allow anonymous users to insert new volunteers
CREATE POLICY "Allow anonymous inserts" ON volunteer_signups_led2025
FOR INSERT TO anon
WITH CHECK (true);
```

## 🧪 Testing the Setup

After running the SQL commands above, test the check-in functionality:

1. **Open your app**: http://localhost:3000
2. **Find a volunteer**: Go to Schedule view and find any volunteer
3. **Click "Check In"**: The button should work without errors
4. **Verify in database**: The `checked_in` status should be `true`

## 🔍 Troubleshooting

### Issue: "Database permissions issue" error

**Solution**: Run the GRANT UPDATE command from Step 2 above.

### Issue: Check-in works but doesn't persist

**Solution**: 
1. Check that RLS policies are correctly configured
2. Verify the anonymous key has the right permissions
3. Look at browser console for detailed error messages

### Issue: Some volunteers can't be updated

**Solution**: 
1. Check for any conflicting RLS policies
2. Ensure all volunteer records have proper IDs
3. Verify no database constraints are blocking updates

## 📊 Database Schema

Your current table structure:

```sql
CREATE TABLE volunteer_signups_led2025 (
  id SERIAL PRIMARY KEY,
  submission_timestamp TIMESTAMP WITH TIME ZONE,
  email_address VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  cell_phone_number VARCHAR(20),
  shpe_chapter VARCHAR(255),
  how_heard_about_opportunity TEXT,
  volunteer_shift_availability TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_in BOOLEAN DEFAULT FALSE
);
```

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set these in your hosting platform:
   ```
   VITE_SUPABASE_URL=https://nwgidprevobilfnxansd.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_VOLUNTEER_TABLE_NAME=volunteer_signups_led2025
   ```

2. **Database Permissions**: Ensure the permissions from Step 2 are applied

3. **Security**: The anonymous key is safe to expose in frontend code as it only has the permissions you explicitly grant

## ✅ Verification Checklist

- [ ] Anonymous role has UPDATE permissions on the table
- [ ] Row Level Security is enabled with appropriate policies
- [ ] App can read volunteer data (51 volunteers visible)
- [ ] Check-in button works without errors
- [ ] Check-in status persists in database
- [ ] Multiple team leaders can use the app simultaneously

## 📞 Support

If you encounter issues:

1. **Check browser console** for detailed error messages
2. **Verify Supabase logs** in your dashboard
3. **Test permissions** using the SQL editor
4. **Contact support** with specific error messages

---

**Next Step**: Run the SQL commands in Step 2 to enable check-in functionality! 🎉
