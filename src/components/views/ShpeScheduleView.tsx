import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Users, Filter } from 'lucide-react';
import { ShpeProcessedVolunteer, SHPE_SHIFT_TIMES } from '../../types/ShpeVolunteerTypes';
import { ShpeVolunteerCard } from '../ShpeVolunteerCard';
import { shpeGroupVolunteersByShift, shpeCountCheckedInByShift, shpeClassNameMerger } from '../../utils/ShpeUtilityHelpers';

interface ShpeScheduleViewProps {
  volunteers: ShpeProcessedVolunteer[];
  onToggleCheckin: (volunteerId: number) => void;
  updatingVolunteerId?: number;
}

export function ShpeScheduleView({ 
  volunteers, 
  onToggleCheckin, 
  updatingVolunteerId 
}: ShpeScheduleViewProps) {
  const [shpeCollapsedShifts, setShpeCollapsedShifts] = useState<Set<string>>(new Set());
  const [shpeShowOnlyCheckedIn, setShpeShowOnlyCheckedIn] = useState<boolean>(false);

  // Group volunteers by shift and apply filters
  const shpeGroupedVolunteers = useMemo(() => {
    const filteredVolunteers = shpeShowOnlyCheckedIn 
      ? volunteers.filter(v => v.checked_in)
      : volunteers;
    
    return shpeGroupVolunteersByShift(filteredVolunteers);
  }, [volunteers, shpeShowOnlyCheckedIn]);

  // Toggle shift section collapse
  const toggleShiftCollapse = (shift: string) => {
    setShpeCollapsedShifts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shift)) {
        newSet.delete(shift);
      } else {
        newSet.add(shift);
      }
      return newSet;
    });
  };

  // Toggle filter for checked-in volunteers only
  const toggleCheckedInFilter = () => {
    setShpeShowOnlyCheckedIn(prev => !prev);
  };

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Found</h3>
        <p className="text-gray-600">Volunteers will appear here once they're loaded from the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        
        <button
          onClick={toggleCheckedInFilter}
          className={shpeClassNameMerger(
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
            shpeShowOnlyCheckedIn
              ? 'bg-success-100 text-success-700 hover:bg-success-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <div className={shpeClassNameMerger(
            'w-4 h-4 rounded border-2 flex items-center justify-center',
            shpeShowOnlyCheckedIn
              ? 'bg-success-600 border-success-600'
              : 'border-gray-300'
          )}>
            {shpeShowOnlyCheckedIn && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span>Show only checked-in volunteers</span>
        </button>
      </div>

      {/* Shift Sections */}
      <div className="space-y-4">
        {SHPE_SHIFT_TIMES.map((shift) => {
          const shiftVolunteers = shpeGroupedVolunteers[shift] || [];
          const isCollapsed = shpeCollapsedShifts.has(shift);
          const checkedInCount = shpeCountCheckedInByShift(volunteers, shift);
          const totalCount = volunteers.filter(v => v.shifts.includes(shift)).length;

          if (shiftVolunteers.length === 0) {
            return null;
          }

          return (
            <div key={shift} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Shift Header */}
              <button
                onClick={() => toggleShiftCollapse(shift)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {isCollapsed ? (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{shift}</h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1 text-success-600">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="font-medium">{checkedInCount}</span>
                    </div>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">{totalCount}</span>
                    <span className="text-gray-500">volunteers</span>
                  </div>
                </div>
              </button>

              {/* Shift Content */}
              {!isCollapsed && (
                <div className="border-t border-gray-100">
                  <div className="p-6 space-y-4">
                    {shiftVolunteers.map((volunteer) => (
                      <ShpeVolunteerCard
                        key={volunteer.id}
                        volunteer={volunteer}
                        onToggleCheckin={onToggleCheckin}
                        isUpdating={updatingVolunteerId === volunteer.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State for Filtered Results */}
      {shpeShowOnlyCheckedIn && Object.keys(shpeGroupedVolunteers).length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Checked-in Volunteers</h3>
          <p className="text-gray-600">No volunteers have been checked in yet.</p>
        </div>
      )}
    </div>
  );
}
