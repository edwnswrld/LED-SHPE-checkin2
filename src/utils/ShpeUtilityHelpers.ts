import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShpeVolunteerData, ShpeProcessedVolunteer, ShpeExportVolunteerData } from '../types/ShpeVolunteerTypes';

// Utility function to merge Tailwind classes safely
export function shpeClassNameMerger(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Process raw volunteer data for UI consumption
export function shpeProcessVolunteerData(volunteer: ShpeVolunteerData): ShpeProcessedVolunteer {
  const shifts = volunteer.volunteer_shift_availability 
    ? volunteer.volunteer_shift_availability.split(',').map(s => s.trim())
    : [];

  return {
    ...volunteer,
    full_name: `${volunteer.first_name} ${volunteer.last_name}`,
    shifts
  };
}

// Search volunteers by name, email, or phone
export function shpeSearchVolunteers(volunteers: ShpeProcessedVolunteer[], searchTerm: string): ShpeProcessedVolunteer[] {
  if (!searchTerm.trim()) return volunteers;
  
  const term = searchTerm.toLowerCase();
  return volunteers.filter(volunteer => 
    volunteer.full_name.toLowerCase().includes(term) ||
    volunteer.email_address.toLowerCase().includes(term) ||
    (volunteer.cell_phone_number && volunteer.cell_phone_number.toLowerCase().includes(term))
  );
}

// Group volunteers by their shift times
export function shpeGroupVolunteersByShift(volunteers: ShpeProcessedVolunteer[]): Record<string, ShpeProcessedVolunteer[]> {
  const grouped: Record<string, ShpeProcessedVolunteer[]> = {};
  
  volunteers.forEach(volunteer => {
    volunteer.shifts.forEach(shift => {
      if (!grouped[shift]) {
        grouped[shift] = [];
      }
      grouped[shift].push(volunteer);
    });
  });
  
  return grouped;
}

// Count checked-in volunteers for a specific shift
export function shpeCountCheckedInByShift(volunteers: ShpeProcessedVolunteer[], shift: string): number {
  return volunteers.filter(v => v.shifts.includes(shift) && v.checked_in).length;
}

// Format volunteer data for CSV export
export function shpeFormatVolunteerForExport(volunteer: ShpeProcessedVolunteer): ShpeExportVolunteerData {
  return {
    name: volunteer.full_name,
    email: volunteer.email_address,
    phone: volunteer.cell_phone_number || '',
    chapter: volunteer.shpe_chapter || '',
    shifts: volunteer.shifts.join('; '),
    checked_in_status: volunteer.checked_in ? 'Yes' : 'No',
    checked_in_time: volunteer.checked_in_at || ''
  };
}

// Generate CSV content from volunteer data
export function shpeGenerateVolunteerCsvContent(volunteers: ShpeProcessedVolunteer[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Chapter', 'Shifts', 'Checked In', 'Check-in Time'];
  const csvRows = [headers.join(',')];
  
  volunteers.forEach(volunteer => {
    const exportData = shpeFormatVolunteerForExport(volunteer);
    const row = [
      `"${exportData.name}"`,
      `"${exportData.email}"`,
      `"${exportData.phone}"`,
      `"${exportData.chapter}"`,
      `"${exportData.shifts}"`,
      `"${exportData.checked_in_status}"`,
      `"${exportData.checked_in_time}"`
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

// Download CSV file with volunteer data
export function shpeDownloadVolunteerCsv(volunteers: ShpeProcessedVolunteer[]): void {
  const csvContent = shpeGenerateVolunteerCsvContent(volunteers);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `volunteers-checkin-${today}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Validate volunteer form data
export function shpeValidateVolunteerForm(formData: {
  first_name: string;
  last_name: string;
  email_address: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!formData.first_name.trim()) {
    errors.push('First name is required');
  }
  
  if (!formData.last_name.trim()) {
    errors.push('Last name is required');
  }
  
  if (!formData.email_address.trim()) {
    errors.push('Email address is required');
  } else if (!isValidEmail(formData.email_address)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Check if email format is valid
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check for duplicate volunteers by name
export function shpeCheckDuplicateVolunteer(
  volunteers: ShpeProcessedVolunteer[], 
  firstName: string, 
  lastName: string
): boolean {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  return volunteers.some(v => v.full_name.toLowerCase() === fullName);
}
