// React import removed - not needed for JSX in React 17+
import { Check, Clock } from 'lucide-react';
import { ShpeProcessedVolunteer } from '../types/ShpeVolunteerTypes';
import { shpeClassNameMerger } from '../utils/ShpeUtilityHelpers';

interface ShpeVolunteerCardProps {
  volunteer: ShpeProcessedVolunteer;
  onToggleCheckin: (volunteerId: number) => void;
  isUpdating?: boolean;
}

export function ShpeVolunteerCard({ 
  volunteer, 
  onToggleCheckin, 
  isUpdating = false 
}: ShpeVolunteerCardProps) {
  const handleCheckinToggle = () => {
    if (!isUpdating) {
      onToggleCheckin(volunteer.id);
    }
  };

  return (
    <div className={shpeClassNameMerger(
      'volunteer-card',
      volunteer.checked_in && 'checked-in',
      isUpdating && 'opacity-70 pointer-events-none'
    )}>
      {/* Volunteer Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {volunteer.full_name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {volunteer.email_address}
          </p>
          {volunteer.cell_phone_number && (
            <p className="text-sm text-gray-600">
              {volunteer.cell_phone_number}
            </p>
          )}
        </div>
        
        {/* Check-in Status Icon */}
        <div className={shpeClassNameMerger(
          'flex items-center justify-center w-8 h-8 rounded-full',
          volunteer.checked_in 
            ? 'bg-success-100 text-success-600' 
            : 'bg-gray-100 text-gray-400'
        )}>
          {volunteer.checked_in ? (
            <Check className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Volunteer Details */}
      <div className="space-y-2 mb-4">
        {volunteer.shpe_chapter && (
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-16">Chapter:</span>
            <span className="text-gray-600">{volunteer.shpe_chapter}</span>
          </div>
        )}
        
        {volunteer.shifts.length > 0 && (
          <div className="flex items-start text-sm">
            <span className="font-medium text-gray-700 w-16 mt-1">Shifts:</span>
            <div className="flex-1">
              {volunteer.shifts.map((shift, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs mr-1 mb-1"
                >
                  {shift}
                </span>
              ))}
            </div>
          </div>
        )}

        {volunteer.checked_in && volunteer.checked_in_at && (
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-16">Checked:</span>
            <span className="text-success-600">
              {new Date(volunteer.checked_in_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>

      {/* Check-in Toggle Button */}
      <button
        onClick={handleCheckinToggle}
        disabled={isUpdating}
        className={shpeClassNameMerger(
          'checkin-button w-full flex items-center justify-center space-x-2',
          volunteer.checked_in ? 'checked-in' : 'not-checked-in',
          isUpdating && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isUpdating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Updating...</span>
          </>
        ) : volunteer.checked_in ? (
          <>
            <Check className="w-4 h-4" />
            <span>Check Out</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>Check In</span>
          </>
        )}
      </button>
    </div>
  );
}
