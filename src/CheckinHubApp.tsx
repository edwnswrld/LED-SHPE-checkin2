import { useState } from 'react';
import { RefreshCw, Download, Users, Clock, AlertTriangle } from 'lucide-react';
import { ShpeNavigationTab, ShpeNewVolunteerForm } from './types/ShpeVolunteerTypes';
import { useShpeVolunteers } from './hooks/useShpeVolunteers';
import { ShpeNavigationPills } from './components/ShpeNavigationPills';
import { ShpeScheduleView } from './components/views/ShpeScheduleView';
import { ShpeSearchView } from './components/views/ShpeSearchView';
import { ShpeAddVolunteerView } from './components/views/ShpeAddVolunteerView';
import { shpeClassNameMerger } from './utils/ShpeUtilityHelpers';

export default function CheckinHubApp() {
  const [shpeActiveTab, setShpeActiveTab] = useState<ShpeNavigationTab>('schedule');
  const [shpeUpdatingVolunteerId, setShpeUpdatingVolunteerId] = useState<number | undefined>();
  const [shpeIsAddingVolunteer, setShpeIsAddingVolunteer] = useState<boolean>(false);

  const {
    shpeVolunteers,
    shpeIsLoading,
    shpeError,
    shpeLastRefresh,
    shpeLoadVolunteers,
    shpeToggleCheckin,
    shpeAddVolunteer,
    shpeSearchVolunteersByTerm,
    shpeExportVolunteersCsv,
    shpeClearError,
    shpeGetCheckedInCount
  } = useShpeVolunteers();

  // Handle volunteer check-in toggle with loading state
  const handleVolunteerCheckinToggle = async (volunteerId: number) => {
    setShpeUpdatingVolunteerId(volunteerId);
    try {
      await shpeToggleCheckin(volunteerId);
    } finally {
      setShpeUpdatingVolunteerId(undefined);
    }
  };

  // Handle adding new volunteer with loading state
  const handleAddNewVolunteer = async (volunteerData: ShpeNewVolunteerForm) => {
    setShpeIsAddingVolunteer(true);
    try {
      return await shpeAddVolunteer(volunteerData);
    } finally {
      setShpeIsAddingVolunteer(false);
    }
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    shpeLoadVolunteers();
  };

  // Handle CSV export
  const handleCsvExport = () => {
    shpeExportVolunteersCsv();
  };

  // Render current view based on active tab
  const renderShpeCurrentView = () => {
    switch (shpeActiveTab) {
      case 'schedule':
        return (
          <ShpeScheduleView
            volunteers={shpeVolunteers}
            onToggleCheckin={handleVolunteerCheckinToggle}
            updatingVolunteerId={shpeUpdatingVolunteerId}
          />
        );
      case 'search':
        return (
          <ShpeSearchView
            volunteers={shpeVolunteers}
            onToggleCheckin={handleVolunteerCheckinToggle}
            onSearchVolunteers={shpeSearchVolunteersByTerm}
            updatingVolunteerId={shpeUpdatingVolunteerId}
          />
        );
      case 'add-volunteer':
        return (
          <ShpeAddVolunteerView
            onAddVolunteer={handleAddNewVolunteer}
            isAdding={shpeIsAddingVolunteer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Title and Stats */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SHPE Check-in Hub</h1>
              <p className="text-sm text-gray-600">Latinx Engineering Day 2025</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Check-in Counter */}
              <div className="flex items-center space-x-2 bg-success-50 text-success-700 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {shpeGetCheckedInCount()} / {shpeVolunteers.length} checked in
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleManualRefresh}
                disabled={shpeIsLoading}
                className={shpeClassNameMerger(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200',
                  shpeIsLoading && 'opacity-50 cursor-not-allowed'
                )}
                title="Refresh data"
              >
                <RefreshCw className={shpeClassNameMerger(
                  'w-4 h-4',
                  shpeIsLoading && 'animate-spin'
                )} />
                <span className="hidden sm:inline text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <ShpeNavigationPills
            activeTab={shpeActiveTab}
            onTabChange={setShpeActiveTab}
          />

          {/* Last Refresh Info */}
          {shpeLastRefresh && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
              <Clock className="w-3 h-3" />
              <span>
                Last updated: {shpeLastRefresh.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {shpeError && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{shpeError}</span>
              </div>
              <button
                onClick={shpeClearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {shpeIsLoading && shpeVolunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : (
          renderShpeCurrentView()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">
                SHPE Check-in Hub for Latinx Engineering Day 2025
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Auto-refresh every 60 seconds • {shpeVolunteers.length} total volunteers
              </p>
            </div>
            
            {/* Export Button */}
            <button
              onClick={handleCsvExport}
              disabled={shpeVolunteers.length === 0}
              className={shpeClassNameMerger(
                'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                shpeVolunteers.length > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
