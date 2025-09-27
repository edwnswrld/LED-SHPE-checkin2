# Quick Setup Guide

## 🚀 Development Mode (No Database Required)

The app is ready to use immediately with mock data:

```bash
npm run dev
```

Open http://localhost:3000 - the app will automatically run in development mode with sample volunteers.

## 🔧 Console Messages Explained

You'll see these helpful console messages:

- **🔧 Running in development mode with mock data** - App is using sample data
- **📋 Loading mock volunteer data for development** - Sample volunteers loaded
- **✅ Mock: Toggling volunteer X to checked-in** - Check-in simulation working

## 🗄️ Production Mode (With Supabase Database)

To connect to a real database:

1. **Create a Supabase project** at https://supabase.com
2. **Create the volunteer table** using the schema in documentation.md
3. **Get your credentials** from Supabase project settings
4. **Create .env.local file**:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_VOLUNTEER_TABLE_NAME=volunteer_signups_led2025
   ```
5. **Restart the server** - app will automatically detect valid credentials

## ✅ Features Working in Development Mode

- ✅ Volunteer check-in/check-out toggle
- ✅ Search volunteers by name, email, phone
- ✅ Add new walk-in volunteers
- ✅ Export CSV with volunteer data
- ✅ Mobile-optimized iOS-style navigation
- ✅ Real-time UI updates (simulated)

## 🎯 Testing the App

1. **Check-in volunteers** - Click "Check In" buttons, they should work without errors
2. **Search functionality** - Try searching for "Jesus" or "Maria"
3. **Add volunteers** - Go to Add Volunteer tab and create a new entry
4. **Export data** - Click "Export CSV" in the footer

The app is fully functional in development mode and ready for production deployment!
