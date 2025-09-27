import { useState, useEffect, useCallback } from 'react';
import { ShpeProcessedVolunteer, ShpeNewVolunteerForm } from '../types/ShpeVolunteerTypes';
import { shpeVolunteerService } from '../services/ShpeVolunteerService';
import { 
  shpeProcessVolunteerData, 
  shpeSearchVolunteers,
  shpeCheckDuplicateVolunteer,
  shpeDownloadVolunteerCsv 
} from '../utils/ShpeUtilityHelpers';

// Custom hook for managing SHPE volunteers
export function useShpeVolunteers() {
  const [shpeVolunteers, setShpeVolunteers] = useState<ShpeProcessedVolunteer[]>([]);
  const [shpeIsLoading, setShpeIsLoading] = useState<boolean>(true);
  const [shpeError, setShpeError] = useState<string | null>(null);
  const [shpeLastRefresh, setShpeLastRefresh] = useState<Date | null>(null);

  // Load volunteers from Supabase
  const shpeLoadVolunteers = useCallback(async () => {
    setShpeIsLoading(true);
    setShpeError(null);

    try {
      const response = await shpeVolunteerService.shpeFetchAllVolunteers();
      
      if (response.success && response.data) {
        const processedVolunteers = response.data.map(shpeProcessVolunteerData);
        setShpeVolunteers(processedVolunteers);
        setShpeLastRefresh(new Date());
      } else {
        setShpeError(response.error || 'Failed to load volunteers');
      }
    } catch (err) {
      setShpeError('Network error occurred while loading volunteers');
      console.error('Load volunteers error:', err);
    } finally {
      setShpeIsLoading(false);
    }
  }, []);

  // Toggle volunteer check-in status
  const shpeToggleCheckin = useCallback(async (volunteerId: number): Promise<boolean> => {
    const volunteer = shpeVolunteers.find(v => v.id === volunteerId);
    if (!volunteer) return false;

    const newCheckedInStatus = !volunteer.checked_in;

    // Optimistic update - update UI immediately
    setShpeVolunteers(prev => 
      prev.map(v => 
        v.id === volunteerId 
          ? { 
              ...v, 
              checked_in: newCheckedInStatus,
              checked_in_at: newCheckedInStatus ? new Date().toISOString() : undefined
            }
          : v
      )
    );

    try {
      const response = await shpeVolunteerService.shpeToggleVolunteerCheckin(
        volunteerId, 
        newCheckedInStatus
      );

      if (!response.success) {
        // Revert optimistic update on failure
        setShpeVolunteers(prev => 
          prev.map(v => 
            v.id === volunteerId 
              ? { ...v, checked_in: volunteer.checked_in }
              : v
          )
        );
        setShpeError(response.error || 'Failed to update check-in status');
        return false;
      }

      return true;
    } catch (err) {
      // Revert optimistic update on error
      setShpeVolunteers(prev => 
        prev.map(v => 
          v.id === volunteerId 
            ? { ...v, checked_in: volunteer.checked_in }
            : v
        )
      );
      setShpeError('Network error occurred while updating check-in');
      return false;
    }
  }, [shpeVolunteers]);

  // Add new volunteer
  const shpeAddVolunteer = useCallback(async (volunteerForm: ShpeNewVolunteerForm): Promise<boolean> => {
    // Check for duplicates
    if (shpeCheckDuplicateVolunteer(shpeVolunteers, volunteerForm.first_name, volunteerForm.last_name)) {
      setShpeError('A volunteer with this name already exists');
      return false;
    }

    try {
      const response = await shpeVolunteerService.shpeAddNewVolunteer(volunteerForm);

      if (response.success && response.data) {
        const newProcessedVolunteer = shpeProcessVolunteerData(response.data);
        setShpeVolunteers(prev => [...prev, newProcessedVolunteer]);
        return true;
      } else {
        setShpeError(response.error || 'Failed to add new volunteer');
        return false;
      }
    } catch (err) {
      setShpeError('Network error occurred while adding volunteer');
      console.error('Add volunteer error:', err);
      return false;
    }
  }, [shpeVolunteers]);

  // Search volunteers
  const shpeSearchVolunteersByTerm = useCallback((searchTerm: string): ShpeProcessedVolunteer[] => {
    return shpeSearchVolunteers(shpeVolunteers, searchTerm);
  }, [shpeVolunteers]);

  // Export volunteers to CSV
  const shpeExportVolunteersCsv = useCallback(() => {
    shpeDownloadVolunteerCsv(shpeVolunteers);
  }, [shpeVolunteers]);

  // Get checked-in volunteers count
  const shpeGetCheckedInCount = useCallback((): number => {
    return shpeVolunteers.filter(v => v.checked_in).length;
  }, [shpeVolunteers]);

  // Filter only checked-in volunteers
  const shpeGetCheckedInVolunteers = useCallback((): ShpeProcessedVolunteer[] => {
    return shpeVolunteers.filter(v => v.checked_in);
  }, [shpeVolunteers]);

  // Clear error message
  const shpeClearError = useCallback(() => {
    setShpeError(null);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    // Initial load
    shpeLoadVolunteers();

    // Set up auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      shpeLoadVolunteers();
    }, 60000); // 60 seconds

    return () => clearInterval(refreshInterval);
  }, [shpeLoadVolunteers]);

  return {
    // Data
    shpeVolunteers,
    shpeIsLoading,
    shpeError,
    shpeLastRefresh,
    
    // Actions
    shpeLoadVolunteers,
    shpeToggleCheckin,
    shpeAddVolunteer,
    shpeSearchVolunteersByTerm,
    shpeExportVolunteersCsv,
    shpeClearError,
    
    // Computed values
    shpeGetCheckedInCount,
    shpeGetCheckedInVolunteers
  };
}
