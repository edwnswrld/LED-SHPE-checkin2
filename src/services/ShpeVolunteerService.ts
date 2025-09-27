import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ShpeVolunteerData, ShpeNewVolunteerForm, ShpeApiResponse } from '../types/ShpeVolunteerTypes';

// Supabase client configuration
class ShpeSupabaseService {
  private supabaseClient: SupabaseClient | null = null;
  private tableName: string;

  constructor() {
    this.tableName = import.meta.env.VITE_VOLUNTEER_TABLE_NAME || 'volunteer_signups_led2025';
    this.initializeSupabaseClient();
  }

  private initializeSupabaseClient(): void {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Check if we have valid Supabase credentials (not placeholder values)
    const hasValidCredentials = supabaseUrl && 
                               supabaseKey && 
                               supabaseUrl !== 'your_supabase_url' && 
                               supabaseKey !== 'your_supabase_anon_key' &&
                               supabaseUrl.includes('supabase.co') &&
                               supabaseKey.length > 20; // JWT tokens are much longer than placeholders

    if (hasValidCredentials) {
      try {
        this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase client initialized successfully');
      } catch (error) {
        console.warn('❌ Failed to initialize Supabase client:', error);
        this.supabaseClient = null;
      }
    } else {
      console.log('🔧 Running in development mode with mock data (Supabase not configured)');
    }
  }

  // Check if Supabase is properly configured
  private isSupabaseConfigured(): boolean {
    return this.supabaseClient !== null;
  }

  // Fetch all volunteers from Supabase - PRODUCTION VERSION
  async shpeFetchAllVolunteers(): Promise<ShpeApiResponse<ShpeVolunteerData[]>> {
    if (!this.isSupabaseConfigured()) {
      console.error('❌ PRODUCTION ERROR: Supabase not configured! Please check environment variables.');
      return {
        data: [],
        error: 'Database not configured. Please check Supabase connection.',
        success: false
      };
    }

    try {
      console.log('🔄 Fetching volunteers from Supabase...');
      const { data, error } = await this.supabaseClient!
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        return {
          data: [],
          error: `Database error: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Successfully fetched', data?.length || 0, 'volunteers from Supabase');
      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (err) {
      console.error('❌ Network error:', err);
      return {
        data: [],
        error: 'Network error. Please check your internet connection.',
        success: false
      };
    }
  }

  // Toggle volunteer check-in status - PRODUCTION VERSION
  async shpeToggleVolunteerCheckin(volunteerId: number, checkedIn: boolean): Promise<ShpeApiResponse<ShpeVolunteerData>> {
    if (!this.isSupabaseConfigured()) {
      console.error('❌ PRODUCTION ERROR: Cannot toggle check-in - Supabase not configured!');
      return {
        data: null,
        error: 'Database not configured. Please check Supabase connection.',
        success: false
      };
    }

    try {
      console.log(`🔄 Updating volunteer ${volunteerId} check-in status to ${checkedIn}`);
      const updateData: Partial<ShpeVolunteerData> = {
        checked_in: checkedIn,
        updated_at: new Date().toISOString()
      };

      // Note: checked_in_at column may not exist in the current table schema
      // We'll track the timestamp in updated_at for now

      const { data, error } = await this.supabaseClient!
        .from(this.tableName)
        .update(updateData)
        .eq('id', volunteerId)
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Supabase update error:', error);
        
        // Check if it's a permissions error
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          return {
            data: null,
            error: 'Database permissions issue. Please contact your administrator to grant UPDATE permissions to the anonymous role for the volunteer_signups_led2025 table.',
            success: false
          };
        }
        
        // Return actual error for production
        return {
          data: null,
          error: `Database error: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Successfully updated volunteer check-in status');
      return {
        data: data,
        error: null,
        success: true
      };
    } catch (err) {
      console.error('❌ Network error during update:', err);
      return {
        data: null,
        error: 'Network error. Please check your internet connection.',
        success: false
      };
    }
  }

  // Add new volunteer to database - PRODUCTION VERSION
  async shpeAddNewVolunteer(volunteerForm: ShpeNewVolunteerForm): Promise<ShpeApiResponse<ShpeVolunteerData>> {
    if (!this.isSupabaseConfigured()) {
      console.error('❌ PRODUCTION ERROR: Cannot add volunteer - Supabase not configured!');
      return {
        data: null,
        error: 'Database not configured. Please check Supabase connection.',
        success: false
      };
    }

    try {
      console.log('🔄 Adding new volunteer to Supabase:', volunteerForm.first_name, volunteerForm.last_name);
      const newVolunteerData = {
        email_address: volunteerForm.email_address,
        first_name: volunteerForm.first_name,
        last_name: volunteerForm.last_name,
        cell_phone_number: volunteerForm.cell_phone_number || null,
        shpe_chapter: volunteerForm.shpe_chapter || null,
        how_heard_about_opportunity: volunteerForm.how_heard_about_opportunity || null,
        volunteer_shift_availability: volunteerForm.selected_shifts.join(', '),
        checked_in: true, // Auto-check-in new volunteers
        submission_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabaseClient!
        .from(this.tableName)
        .insert([newVolunteerData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        return {
          data: null,
          error: `Database error: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Successfully added new volunteer to Supabase');
      return {
        data: data,
        error: null,
        success: true
      };
    } catch (err) {
      console.error('❌ Network error during volunteer addition:', err);
      return {
        data: null,
        error: 'Network error. Please check your internet connection.',
        success: false
      };
    }
  }

  // PRODUCTION VERSION - No mock data
}

// Export singleton instance
export const shpeVolunteerService = new ShpeSupabaseService();
