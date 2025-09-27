// Core volunteer data types for SHPE Check-in Hub
export interface ShpeVolunteerData {
  id: number;
  submission_timestamp?: string;
  email_address: string;
  first_name: string;
  last_name: string;
  cell_phone_number?: string;
  shpe_chapter?: string;
  how_heard_about_opportunity?: string;
  volunteer_shift_availability?: string;
  checked_in: boolean;
  created_at?: string;
  updated_at?: string;
  checked_in_at?: string; // May not exist in current database schema
}

// Processed volunteer data for UI components
export interface ShpeProcessedVolunteer extends ShpeVolunteerData {
  full_name: string;
  shifts: string[];
}

// Available shift times for the event (matching database format)
export const SHPE_SHIFT_TIMES = [
  '9:30AM - 11PM',     // Matches database: "9:30AM - 11PM"
  '11AM - 1PM',        // Matches database: "11AM - 1PM" 
  '1AM - 2:30PM',      // Matches database: "1AM - 2:30PM"
  '2:30PM - 4:30PM'    // Matches database: "2:30PM - 4:30PM"
] as const;

export type ShpeShiftTime = typeof SHPE_SHIFT_TIMES[number];

// Navigation tab types for the app
export type ShpeNavigationTab = 'schedule' | 'search' | 'add-volunteer';

// Form data for adding new volunteers
export interface ShpeNewVolunteerForm {
  first_name: string;
  last_name: string;
  email_address: string;
  cell_phone_number?: string;
  shpe_chapter?: string;
  how_heard_about_opportunity?: string;
  selected_shifts: string[];
}

// API response types
export interface ShpeApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Export data structure for CSV
export interface ShpeExportVolunteerData {
  name: string;
  email: string;
  phone: string;
  chapter: string;
  shifts: string;
  checked_in_status: string;
  checked_in_time: string;
}
