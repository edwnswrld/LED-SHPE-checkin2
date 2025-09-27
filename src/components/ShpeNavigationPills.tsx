// React import removed - not needed for JSX in React 17+
import { Calendar, Search, UserPlus } from 'lucide-react';
import { ShpeNavigationTab } from '../types/ShpeVolunteerTypes';
import { shpeClassNameMerger } from '../utils/ShpeUtilityHelpers';

interface ShpeNavigationPillsProps {
  activeTab: ShpeNavigationTab;
  onTabChange: (tab: ShpeNavigationTab) => void;
}

const SHPE_NAV_TABS = [
  { id: 'schedule' as ShpeNavigationTab, label: 'Schedule', icon: Calendar },
  { id: 'search' as ShpeNavigationTab, label: 'Search', icon: Search },
  { id: 'add-volunteer' as ShpeNavigationTab, label: 'Add Volunteer', icon: UserPlus }
];

export function ShpeNavigationPills({ activeTab, onTabChange }: ShpeNavigationPillsProps) {
  const activeTabIndex = SHPE_NAV_TABS.findIndex(tab => tab.id === activeTab);
  const sliderTransform = `translateX(${activeTabIndex * 100}%)`;

  return (
    <div className="nav-pill-container">
      {/* Background Slider */}
      <div 
        className="nav-pill-slider"
        style={{ 
          transform: sliderTransform,
          width: `${100 / SHPE_NAV_TABS.length}%`
        }}
      />
      
      {/* Navigation Tabs */}
      {SHPE_NAV_TABS.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={shpeClassNameMerger(
              'nav-pill-item flex items-center space-x-2 flex-1 justify-center',
              isActive && 'active'
            )}
          >
            <IconComponent className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
