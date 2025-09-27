import React, { useState, useMemo } from 'react';
import { Users, Search as SearchIcon } from 'lucide-react';
import { ShpeProcessedVolunteer } from '../../types/ShpeVolunteerTypes';
import { ShpeVolunteerCard } from '../ShpeVolunteerCard';
import { ShpeSearchBar } from '../ShpeSearchBar';

interface ShpeSearchViewProps {
  volunteers: ShpeProcessedVolunteer[];
  onToggleCheckin: (volunteerId: number) => void;
  onSearchVolunteers: (searchTerm: string) => ShpeProcessedVolunteer[];
  updatingVolunteerId?: number;
}

export function ShpeSearchView({ 
  volunteers, 
  onToggleCheckin, 
  onSearchVolunteers,
  updatingVolunteerId 
}: ShpeSearchViewProps) {
  const [shpeSearchTerm, setShpeSearchTerm] = useState<string>('');

  // Get filtered volunteers based on search term
  const shpeFilteredVolunteers = useMemo(() => {
    return onSearchVolunteers(shpeSearchTerm);
  }, [onSearchVolunteers, shpeSearchTerm]);

  const handleSearchChange = (searchTerm: string) => {
    setShpeSearchTerm(searchTerm);
  };

  // Show all volunteers when no search term
  const volunteersToShow = shpeSearchTerm.trim() ? shpeFilteredVolunteers : volunteers;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <SearchIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Search Volunteers</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Find volunteers by name, email, or phone number. All volunteers are shown regardless of check-in status.
        </p>
        
        <ShpeSearchBar 
          onSearchChange={handleSearchChange}
          placeholder="Search by name, email, or phone..."
        />
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {shpeSearchTerm.trim() ? 'Search Results' : 'All Volunteers'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{volunteersToShow.length} volunteer{volunteersToShow.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          {shpeSearchTerm.trim() && (
            <p className="text-sm text-gray-500 mt-2">
              Showing results for "{shpeSearchTerm}"
            </p>
          )}
        </div>

        <div className="p-6">
          {volunteersToShow.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {shpeSearchTerm.trim() ? (
                <>
                  <SearchIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h4>
                  <p className="text-gray-600">
                    No volunteers match your search for "{shpeSearchTerm}". 
                    Try searching with a different term.
                  </p>
                </>
              ) : (
                <>
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Volunteers</h4>
                  <p className="text-gray-600">
                    No volunteers have been loaded yet. Please wait for data to sync.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {volunteersToShow.map((volunteer) => (
                <ShpeVolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  onToggleCheckin={onToggleCheckin}
                  isUpdating={updatingVolunteerId === volunteer.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Tips */}
      {volunteers.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Search Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Search by first name, last name, or full name</li>
            <li>• Use email address to find specific volunteers</li>
            <li>• Phone numbers can be searched with or without formatting</li>
            <li>• Search is not case-sensitive</li>
          </ul>
        </div>
      )}
    </div>
  );
}
