import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { shpeClassNameMerger } from '../utils/ShpeUtilityHelpers';

interface ShpeSearchBarProps {
  placeholder?: string;
  onSearchChange: (searchTerm: string) => void;
  className?: string;
}

export function ShpeSearchBar({ 
  placeholder = "Search by name, email, or phone...", 
  onSearchChange,
  className 
}: ShpeSearchBarProps) {
  const [shpeSearchTerm, setShpeSearchTerm] = useState<string>('');

  // Debounced search to avoid excessive API calls
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      onSearchChange(shpeSearchTerm);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [shpeSearchTerm, onSearchChange]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShpeSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setShpeSearchTerm('');
  };

  return (
    <div className={shpeClassNameMerger(
      'relative flex items-center',
      className
    )}>
      {/* Search Icon */}
      <div className="absolute left-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={shpeSearchTerm}
        onChange={handleSearchInputChange}
        placeholder={placeholder}
        className={shpeClassNameMerger(
          'w-full pl-10 pr-10 py-3 text-base',
          'bg-white border border-gray-200 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder-gray-500 text-gray-900',
          'transition-colors duration-200'
        )}
      />

      {/* Clear Button */}
      {shpeSearchTerm && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
