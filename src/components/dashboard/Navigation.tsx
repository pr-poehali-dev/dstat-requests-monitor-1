import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Главная', icon: 'Home' },
  { id: 'charts', label: 'Графики', icon: 'AreaChart' },
  { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
  { id: 'alerts', label: 'Алерты', icon: 'Bell' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' }
];

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-16'} transition-all duration-300 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-dashboard-blue to-dashboard-green rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">DSTAT</h1>
                <p className="text-xs text-gray-500">Monitoring</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2"
          >
            <Icon name={isExpanded ? 'ChevronLeft' : 'ChevronRight'} size={16} />
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? 'default' : 'ghost'}
            className={`w-full justify-start h-12 ${!isExpanded ? 'px-3' : 'px-4'} ${
              activeSection === item.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <Icon name={item.icon} size={20} />
            {isExpanded && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${!isExpanded ? 'justify-center' : 'space-x-3'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-dashboard-green rounded-full animate-pulse" />
            {isExpanded && (
              <div>
                <p className="text-sm font-medium text-gray-900">Online</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}