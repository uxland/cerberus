import React from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView, CalendarTheme } from '../types/calendar';
import { formatDate } from '../utils/calendar';
import { cn } from '../lib/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  availableViews: CalendarView[];
  enableNavigation: boolean;
  enableViewSelector: boolean;
  theme?: CalendarTheme;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  availableViews,
  enableNavigation,
  enableViewSelector,
  theme,
  onNavigate,
  onToday,
  onViewChange,
}) => {
  const getDateFormat = () => {
    switch (view) {
      case 'day':
        return 'EEEE, d MMMM yyyy';
      case 'week':
        return 'MMMM yyyy';
      case 'month':
        return 'MMMM yyyy';
      default:
        return 'MMMM yyyy';
    }
  };

  const viewLabels = {
    day: 'Día',
    week: 'Semana',
    month: 'Mes'
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b",
        "bg-white border-gray-200"
      )}
      style={{
        backgroundColor: theme?.header?.background,
        color: theme?.header?.text,
        borderColor: theme?.border
      }}
    >
      <div className="flex items-center space-x-4">
        {enableNavigation && (
          <>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('prev')}
                className={cn(
                  "h-8 w-8 p-0 calendar-button",
                  theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
                )}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: theme?.border || '#e5e7eb',
                  color: theme?.header?.text || '#374151'
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('next')}
                className={cn(
                  "h-8 w-8 p-0 calendar-button",
                  theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
                )}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: theme?.border || '#e5e7eb',
                  color: theme?.header?.text || '#374151'
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className={cn(
                "text-sm calendar-button",
                theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
              )}
              style={{
                backgroundColor: 'transparent',
                borderColor: theme?.border || '#e5e7eb',
                color: theme?.header?.text || '#374151'
              }}
            >
              Hoy
            </Button>
          </>
        )}
        <h1 className="text-xl font-semibold">
          {formatDate(currentDate, getDateFormat())}
        </h1>
      </div>

      {enableViewSelector && availableViews.length > 1 && (
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger
            className={cn(
              "w-32 calendar-button",
              theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
            )}
            style={{
              backgroundColor: 'transparent',
              borderColor: theme?.border || '#e5e7eb',
              color: theme?.header?.text || '#374151'
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: theme?.surface || '#ffffff',
              borderColor: theme?.border || '#e5e7eb',
              color: theme?.text?.primary || '#111827'
            }}
          >
            {availableViews.map((viewOption) => (
              <SelectItem
                key={viewOption}
                value={viewOption}
                className={cn(
                  "view-selector-item",
                  theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
                )}
                style={{
                  color: theme?.text?.primary || '#111827'
                }}
              >
                {viewLabels[viewOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CalendarHeader;
