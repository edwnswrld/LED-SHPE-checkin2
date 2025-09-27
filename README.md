# SHPE Check-in Hub

A mobile-optimized React web application for managing volunteer check-ins during **Latinx Engineering Day 2025**. Built for team leaders to efficiently check in pre-registered volunteers and register new walk-in volunteers on-site.

## 🌟 Features

### Core Functionality
- **Real-time Check-ins**: Toggle volunteers between checked-in/out states with immediate sync
- **Schedule View**: Organize volunteers by shift times with collapsible sections
- **Search & Find**: Quick volunteer lookup by name, email, or phone number
- **Walk-in Registration**: Add new volunteers on-site with automatic check-in
- **CSV Export**: Download complete volunteer data with check-in status

### Mobile-First Design
- **iOS 16-style Navigation**: Smooth pill navigation with sliding animations
- **Touch-Optimized**: Large buttons and touch targets for mobile devices
- **Responsive Layout**: Adapts seamlessly to phones, tablets, and desktop
- **Offline Resilient**: Graceful fallback when network is unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (required for production)

### Installation

1. **Clone and Install**
   ```bash
   cd 2checkin
   npm install
   ```

2. **Environment Setup** (Required for Production)
   ```bash
   # Create .env file with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_VOLUNTEER_TABLE_NAME=volunteer_signups_led2025
   ```
   
   **⚠️ Important**: For check-in functionality to work, run this SQL in Supabase:
   ```sql
   GRANT UPDATE (checked_in, updated_at) ON volunteer_signups_led2025 TO anon;
   ```
   📖 See `SUPABASE_SETUP.md` for detailed setup instructions.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📱 Usage Guide

### For Team Leaders

#### Checking In Volunteers
1. Open the app on your mobile device
2. Navigate to **Schedule** tab (default view)
3. Find the volunteer by shift time or use **Search** tab
4. Tap "Check In" button on their volunteer card
5. Status updates automatically across all devices

#### Adding Walk-in Volunteers
1. Go to **Add Volunteer** tab
2. Fill required fields: First Name, Last Name, Email
3. Select available shift times
4. Tap "Add Volunteer" - they're automatically checked in

#### Exporting Data
1. Scroll to bottom footer on any tab
2. Tap "Export CSV" to download volunteer data
3. File includes names, contact info, shifts, and check-in status

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent icons

### Backend Integration
- **Supabase** for real-time database and API
- **PostgreSQL** database with volunteer table
- **Auto-refresh** every 60 seconds for sync

### Key Components
- `ShpeVolunteerCard` - Individual volunteer display with check-in toggle
- `ShpeNavigationPills` - iOS 16-style tab navigation
- `ShpeScheduleView` - Shift-organized volunteer display
- `ShpeSearchView` - Real-time volunteer search
- `ShpeAddVolunteerView` - New volunteer registration form

## 🗄️ Database Schema

```sql
CREATE TABLE volunteer_signups_led2025 (
  id SERIAL PRIMARY KEY,
  submission_timestamp TIMESTAMP,
  email_address VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  cell_phone_number VARCHAR,
  shpe_chapter VARCHAR,
  how_heard_about_opportunity VARCHAR,
  volunteer_shift_availability TEXT,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Event Details

- **Event**: Latinx Engineering Day 2025
- **Expected Volunteers**: 50-60 people
- **Shift Times**: 
  - 9:30AM - 11:00AM
  - 11:00AM - 1:00PM
  - 1:00PM - 2:30PM
  - 2:30PM - 4:30PM
- **Concurrent Users**: 3-5 team leaders simultaneously

## 🔧 Development

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── views/           # Main view components
│   ├── ShpeVolunteerCard.tsx
│   ├── ShpeSearchBar.tsx
│   └── ShpeNavigationPills.tsx
├── hooks/               # Custom React hooks
│   └── useShpeVolunteers.ts
├── services/            # API and external services
│   └── ShpeVolunteerService.ts
├── types/               # TypeScript type definitions
│   └── ShpeVolunteerTypes.ts
├── utils/               # Utility functions
│   └── ShpeUtilityHelpers.ts
└── CheckinHubApp.tsx    # Main app component
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- **Unique Naming**: All classes, variables, and functions prefixed with `shpe` to prevent collisions
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Modular, reusable components

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder
- **Static Hosting**: Any web server can serve the built files

### Environment Variables
Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` 
- `VITE_VOLUNTEER_TABLE_NAME`

## 🔒 Security & Privacy

- **No Authentication Required**: All team leaders have equal access
- **Anonymous Database Access**: Uses Supabase anonymous key
- **Event-Specific Data**: Volunteer information is scoped to this event
- **Client-Side Validation**: Form validation for data integrity

## 🐛 Troubleshooting

### Common Issues

**Volunteers not loading**
- Check Supabase connection and credentials
- Verify table name matches environment variable
- App falls back to mock data if Supabase unavailable

**Check-in not syncing**
- Wait for next auto-refresh (60 seconds)
- Try manual refresh button in header
- Check network connectivity

**Mobile layout issues**
- Ensure viewport meta tag is present
- Check responsive Tailwind classes
- Test on actual devices vs browser dev tools

## 📞 Support

For technical issues:
1. Check browser console for error messages
2. Verify Supabase table schema and permissions
3. Monitor network requests and response times
4. Review the comprehensive documentation.md file

## 🎉 Success Metrics

The app successfully delivers:
- ✅ Real-time check-in status across all devices
- ✅ Mobile-optimized iOS 16-style navigation  
- ✅ Comprehensive volunteer search and management
- ✅ Automatic new volunteer registration with check-in
- ✅ Export functionality for post-event reporting
- ✅ Graceful error handling and offline support

Built with ❤️ for the SHPE community and Latinx Engineering Day 2025.
