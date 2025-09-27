# SHPE Check-in Hub - Complete Documentation

## Overview
The **SHPE Check-in Hub** is a React-based web application designed for **Latinx Engineering Day 2025** to manage volunteer check-ins during the on-site event. The application is used by **team leaders** to check in pre-registered volunteers and register new walk-in volunteers.

## Event Context
- **Event**: Latinx Engineering Day 2025
- **Scale**: 50-60 volunteers expected
- **Location**: On-site physical event
- **Users**: 3-5 team leaders simultaneously
- **Devices**: Personal devices (mobile/tablet optimized)

## Core Functionality

### 1. Volunteer Check-in System
- **Purpose**: Track volunteer attendance at the event
- **Process**: Team leaders can toggle volunteers between "checked in" and "not checked in" states
- **Persistence**: Check-in status is stored in Supabase database with real-time sync
- **Sync**: Changes appear across all devices after 1-minute auto-refresh
- **Toggle**: Volunteers can be checked in AND unchecked (bidirectional)

### 2. Three Main Views

#### A. Schedule View (Primary)
- **Purpose**: Organize volunteers by their scheduled shift times
- **Shifts**: 
  - 9:30AM - 11:00AM
  - 11:00AM - 1:00PM
  - 1:00PM - 2:30PM
  - 2:30PM - 4:30PM
- **Features**:
  - Collapsible shift sections
  - Shows checked-in count per shift
  - "Show only checked-in volunteers" filter applies HERE
  - Real-time check-in status updates

#### B. Search View
- **Purpose**: Find specific volunteers quickly
- **Search**: By name, email, or phone number
- **Behavior**: Shows ALL volunteers regardless of checked-in status
- **Filter**: "Show only checked-in volunteers" does NOT apply here

#### C. Add Volunteer View
- **Purpose**: Register new walk-in volunteers on-site
- **Required Fields**: First name, Last name, Email
- **Optional Fields**: Phone, Chapter, How they heard about the event
- **Shifts**: Multi-select checkboxes for available shift times
- **Auto-check-in**: New volunteers are automatically marked as checked-in
- **Validation**: Prevents duplicate volunteers (same first + last name)

### 3. Navigation System
- **Design**: iOS 16-style nav pill with rounded background
- **Layout**: Horizontal pill container with smooth transitions
- **Selected State**: Filled background with smooth sliding animation
- **Mobile Optimized**: Touch-friendly spacing and sizing

### 4. Data Management

#### Database Schema (Supabase)
- **Table**: `volunteer_signups_led2025`
- **New Column**: `checked_in` (boolean) - tracks check-in status
- **Primary Source**: Supabase (no CSV fallback)
- **Real-time Updates**: Check-in status persists to database immediately

#### Data Flow
1. **Load**: Fetch all volunteers from Supabase on app start
2. **Check-in**: Update local state + persist to Supabase
3. **Sync**: Auto-refresh every 1 minute to sync across devices
4. **Error Handling**: Show cached data if Supabase is down

### 5. Export Functionality
- **Location**: Footer (accessible from all tabs)
- **Format**: CSV export
- **Content**: Name, Email, Phone, Chapter, Shifts, Check-in Status, Check-in Time
- **Filename**: `volunteers-checkin-YYYY-MM-DD.csv`

## Technical Implementation

### Architecture
- **Frontend**: React + TypeScript + Vite
- **UI Library**: shadcn/ui components + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React hooks + local state
- **Real-time**: Auto-refresh every 60 seconds

### Key Components

#### 1. `Index.tsx` (Main Page)
- **Purpose**: Main application container
- **Features**: 
  - Tab navigation (iOS 16-style pills)
  - Header with check-in counter
  - Footer with export button
  - Auto-refresh functionality

#### 2. `ScheduleView.tsx`
- **Purpose**: Display volunteers grouped by shift times
- **Features**:
  - Collapsible shift sections
  - Check-in counters per shift
  - Filter support (checked-in only)

#### 3. `VolunteerCard.tsx`
- **Purpose**: Individual volunteer display and check-in toggle
- **Features**:
  - Visual state changes (green when checked-in)
  - Toggle button with immediate feedback
  - Volunteer information display

#### 4. `SearchBar.tsx`
- **Purpose**: Search functionality for volunteers
- **Features**:
  - Real-time search as you type
  - Search by name, email, phone

#### 5. `useVolunteers.ts` (Custom Hook)
- **Purpose**: Data management and API interactions
- **Features**:
  - Fetch volunteers from Supabase
  - Toggle check-in status
  - Search functionality
  - Add new volunteers
  - Export to CSV

#### 6. `VolunteerService.ts`
- **Purpose**: Supabase API wrapper
- **Features**:
  - CRUD operations for volunteers
  - Error handling with graceful fallbacks
  - Data transformation between Supabase and app formats

### Database Schema

#### Supabase Table: `volunteer_signups_led2025`
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
  checked_in BOOLEAN DEFAULT FALSE, -- NEW COLUMN
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VOLUNTEER_TABLE_NAME=volunteer_signups_led2025
```

## User Workflow

### Team Leader Check-in Process
1. **Access App**: Open webapp on personal device
2. **View Volunteers**: Navigate to Schedule View (default)
3. **Find Volunteer**: Use search or browse by shift
4. **Check In**: Click "Check In" button on volunteer card
5. **Confirm**: Visual feedback shows volunteer is now checked in
6. **Sync**: Status automatically syncs to other devices within 1 minute

### New Volunteer Registration
1. **Navigate**: Go to "Add Volunteer" tab
2. **Fill Form**: Enter required information (name, email)
3. **Select Shifts**: Choose available shift times
4. **Submit**: Click "Add Volunteer" button
5. **Auto-check-in**: New volunteer is automatically checked in
6. **Validation**: System prevents duplicate names

### Export Process
1. **Access**: Scroll to footer on any tab
2. **Export**: Click "Export CSV" button
3. **Download**: File downloads with current data including check-in status

## Error Handling

### Supabase Connection Issues
- **Behavior**: Show cached data if available
- **Message**: Simple "Supabase is currently down" message
- **Recovery**: Auto-retry on next refresh cycle

### Network Issues
- **Behavior**: Graceful degradation
- **Fallback**: Continue with cached data
- **User Feedback**: Clear error messages

## Mobile Optimization

### iOS 16-Style Navigation
- **Design**: Rounded pill segmented control
- **Animation**: Smooth sliding transitions
- **Touch**: Optimized for finger interaction
- **Responsive**: Adapts to different screen sizes

### Mobile-First Features
- **Large Touch Targets**: Buttons sized for mobile
- **Readable Text**: Appropriate font sizes
- **Scrollable Content**: Optimized for mobile scrolling
- **Responsive Layout**: Adapts to portrait/landscape

## Performance Considerations

### Auto-Refresh Strategy
- **Interval**: Every 60 seconds
- **Scope**: Full data refresh from Supabase
- **Optimization**: Only when app is active
- **Battery**: Minimal impact on mobile devices

### Data Caching
- **Strategy**: Local state management
- **Fallback**: Graceful degradation when offline
- **Persistence**: Check-in status persists to database

## Security Considerations

### Data Access
- **Authentication**: No user authentication required
- **Authorization**: All team leaders have equal access
- **Data Privacy**: Volunteer information is event-specific

### API Security
- **Supabase**: Uses anonymous key for read/write access
- **Validation**: Client-side validation for data integrity
- **Rate Limiting**: Handled by Supabase

## Deployment

### Development Setup

```

### Production Deployment
- **Platform**: Lovable (current) or any static hosting
- **Build**: `npm run build`
- **Environment**: Production environment variables
- **Domain**: Custom domain support available


### Scalability Considerations
- **Database**: Supabase can handle thousands of volunteers
- **Performance**: React app scales well with proper optimization
- **Concurrent Users**: Tested for 3-5 simultaneous users

## Troubleshooting

### Common Issues
1. **Check-in not syncing**: Wait for next auto-refresh (5 minute)
2. **Volunteers not loading**: Check Supabase connection and credentials
3. **Export not working**: Ensure browser allows file downloads
4. **Mobile layout issues**: Check responsive design classes

### Support
- **Technical Issues**: Check browser console for errors
- **Data Issues**: Verify Supabase table schema and permissions
- **Performance Issues**: Monitor network requests and response times

---

## Summary

The SHPE Check-in Hub is a comprehensive volunteer management system designed specifically for Latinx Engineering Day 2025. It provides team leaders with an intuitive, mobile-optimized interface for managing volunteer check-ins, with real-time synchronization across multiple devices. The application balances simplicity with functionality, ensuring smooth operation during the event while maintaining data integrity and user experience.

**Key Success Factors:**
- ✅ Real-time check-in status across all devices
- ✅ Mobile-optimized iOS 16-style navigation
- ✅ Comprehensive volunteer search and management
- ✅ Automatic new volunteer registration with check-in
- ✅ Export functionality for post-event reporting
- ✅ Graceful error handling and offline support
