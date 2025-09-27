import { useState } from 'react';
import { UserPlus, Check, AlertCircle } from 'lucide-react';
import { ShpeNewVolunteerForm, SHPE_SHIFT_TIMES } from '../../types/ShpeVolunteerTypes';
import { shpeValidateVolunteerForm, shpeClassNameMerger } from '../../utils/ShpeUtilityHelpers';

interface ShpeAddVolunteerViewProps {
  onAddVolunteer: (volunteerData: ShpeNewVolunteerForm) => Promise<boolean>;
  isAdding?: boolean;
}

const SHPE_INITIAL_FORM_STATE: ShpeNewVolunteerForm = {
  first_name: '',
  last_name: '',
  email_address: '',
  cell_phone_number: '',
  shpe_chapter: '',
  how_heard_about_opportunity: '',
  selected_shifts: []
};

// Removed dropdown options - now using text inputs for better flexibility

export function ShpeAddVolunteerView({ onAddVolunteer, isAdding = false }: ShpeAddVolunteerViewProps) {
  const [shpeFormData, setShpeFormData] = useState<ShpeNewVolunteerForm>(SHPE_INITIAL_FORM_STATE);
  const [shpeFormErrors, setShpeFormErrors] = useState<string[]>([]);
  const [shpeSubmissionError, setShpeSubmissionError] = useState<string | null>(null);
  const [shpeSubmissionSuccess, setShpeSubmissionSuccess] = useState<boolean>(false);

  // Handle form input changes
  const handleInputChange = (field: keyof ShpeNewVolunteerForm, value: string) => {
    setShpeFormData(prev => ({ ...prev, [field]: value }));
    setShpeFormErrors([]);
    setShpeSubmissionError(null);
    setShpeSubmissionSuccess(false);
  };

  // Handle shift selection
  const handleShiftToggle = (shift: string) => {
    setShpeFormData(prev => ({
      ...prev,
      selected_shifts: prev.selected_shifts.includes(shift)
        ? prev.selected_shifts.filter(s => s !== shift)
        : [...prev.selected_shifts, shift]
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form data
    const validation = shpeValidateVolunteerForm(shpeFormData);
    if (!validation.isValid) {
      setShpeFormErrors(validation.errors);
      return;
    }

    // Check if at least one shift is selected
    if (shpeFormData.selected_shifts.length === 0) {
      setShpeFormErrors(['Please select at least one volunteer shift']);
      return;
    }

    try {
      const success = await onAddVolunteer(shpeFormData);
      
      if (success) {
        setShpeSubmissionSuccess(true);
        setShpeFormData(SHPE_INITIAL_FORM_STATE);
        setShpeFormErrors([]);
        setShpeSubmissionError(null);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setShpeSubmissionSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setShpeSubmissionError('Failed to add volunteer. Please try again.');
    }
  };

  // Reset form
  const handleReset = () => {
    setShpeFormData(SHPE_INITIAL_FORM_STATE);
    setShpeFormErrors([]);
    setShpeSubmissionError(null);
    setShpeSubmissionSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <UserPlus className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Add New Volunteer</h2>
        </div>
        <p className="text-gray-600">
          Register new walk-in volunteers on-site. They will be automatically checked in upon registration.
        </p>
      </div>

      {/* Success Message */}
      {shpeSubmissionSuccess && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-success-600 flex-shrink-0" />
          <div className="text-success-800">
            <p className="font-medium">Volunteer added successfully!</p>
            <p className="text-sm">They have been automatically checked in.</p>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(shpeFormErrors.length > 0 || shpeSubmissionError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-800">
              <p className="font-medium mb-2">Please fix the following errors:</p>
              <ul className="text-sm space-y-1">
                {shpeFormErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {shpeSubmissionError && <li>• {shpeSubmissionError}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
        {/* Required Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Required Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={shpeFormData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={shpeFormData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={shpeFormData.email_address}
              onChange={(e) => handleInputChange('email_address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={shpeFormData.cell_phone_number}
              onChange={(e) => handleInputChange('cell_phone_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SHPE Chapter
            </label>
            <input
              type="text"
              value={shpeFormData.shpe_chapter}
              onChange={(e) => handleInputChange('shpe_chapter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your SHPE chapter (e.g., UCLA, USC, SF Bay Area)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about this opportunity?
            </label>
            <input
              type="text"
              value={shpeFormData.how_heard_about_opportunity}
              onChange={(e) => handleInputChange('how_heard_about_opportunity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Instagram, SHPE Newsletter, Friend referral"
            />
          </div>
        </div>

        {/* Shift Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Shifts *</h3>
          <p className="text-sm text-gray-600">Select all shifts this volunteer is available for.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SHPE_SHIFT_TIMES.map((shift) => (
              <button
                key={shift}
                type="button"
                onClick={() => handleShiftToggle(shift)}
                className={shpeClassNameMerger(
                  'flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors duration-200',
                  shpeFormData.selected_shifts.includes(shift)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                <div className={shpeClassNameMerger(
                  'w-4 h-4 rounded border-2 flex items-center justify-center',
                  shpeFormData.selected_shifts.includes(shift)
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                )}>
                  {shpeFormData.selected_shifts.includes(shift) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{shift}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isAdding}
            className={shpeClassNameMerger(
              'flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200',
              isAdding
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
            )}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding Volunteer...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add Volunteer</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isAdding}
            className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
