import React, { useState, useEffect } from 'react';
import { CalendarProps, CalendarView, CalendarEvent, CalendarConfig } from '../types/calendar';
import { navigateDate } from '../utils/calendar';
import CalendarHeader from './CalendarHeader';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import EventModal from './EventModal';
import { cn } from '../lib/utils';
// Import component styles automatically
import '../styles.css';

const defaultConfig: CalendarConfig = {
  enableEventCreation: true,
  enableEventEditing: true,
  enableViewSelector: true,
  enableNavigation: true,
  enableDragDrop: true,
  enableResize: true,
  defaultView: 'week',
  availableViews: ['day', 'week', 'month'],
  startHour: 0,
  endHour: 24,
  hourHeight: 60,
  theme: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8',
    },
    event: {
      background: '#3b82f6',
      border: '#2563eb',
      text: '#ffffff',
    },
    header: {
      background: '#ffffff',
      text: '#1e293b',
    },
    grid: {
      lines: '#f1f5f9',
      hourLines: '#e2e8f0',
    },
    selection: {
      background: '#dbeafe',
      border: '#3b82f6',
    },
  },
};

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  config = {},
  currentDate: propCurrentDate,
  view: propView,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onDateChange,
  onViewChange,
  className,
}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const [currentDate, setCurrentDate] = useState(propCurrentDate || new Date());
  const [currentView, setCurrentView] = useState<CalendarView>(propView || mergedConfig.defaultView || 'week');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventModalDefaults, setEventModalDefaults] = useState<{
    start?: Date;
    end?: Date;
    allDay?: boolean;
  }>({});

  useEffect(() => {
    if (propCurrentDate) {
      setCurrentDate(propCurrentDate);
    }
  }, [propCurrentDate]);

  useEffect(() => {
    if (propView) {
      setCurrentView(propView);
    }
  }, [propView]);
  useEffect(() => {
    if (mergedConfig.theme?.cssVariables) {
      Object.entries(mergedConfig.theme.cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, String(value));
      });
    }
  }, [mergedConfig.theme]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = navigateDate(currentDate, direction, currentView);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange?.(today);
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      // Si el usuario proporciona onEventClick, solo llamamos a su función
      // sin abrir el modal de edición
      onEventClick(event);
    } else if (mergedConfig.enableEventEditing) {
      // Solo abrimos el modal de edición si enableEventEditing es true
      setSelectedEvent(event);
      setEventModalDefaults({});
      setIsEventModalOpen(true);
    }
    // Si enableEventEditing es false y no hay onEventClick, no hacemos nada
  };

  const handleEventCreate = (start: Date, end: Date, allDay?: boolean) => {
    if (mergedConfig.enableEventCreation) {
      setSelectedEvent(null);
      setEventModalDefaults({ start, end, allDay });
      setIsEventModalOpen(true);
    }
  };

  const handleEventSave = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData } as CalendarEvent;
      onEventUpdate?.(updatedEvent);
    } else {
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
      } as CalendarEvent;
      onEventCreate?.(newEvent.start, newEvent.end, newEvent.allDay, eventData);
    }
  };

  const handleDateClick = (date: Date) => {
    if (currentView === 'month') {
      setCurrentDate(date);
      setCurrentView('day');
      onDateChange?.(date);
      onViewChange?.('day');
    }
  };

  const renderView = () => {
    const commonProps = {
      date: currentDate,
      events,
      theme: mergedConfig.theme,
      enableEventCreation: mergedConfig.enableEventCreation!,
      enableEventEditing: mergedConfig.enableEventEditing!,
      enableDragDrop: mergedConfig.enableDragDrop!,
      enableResize: mergedConfig.enableResize!,
      onEventClick: handleEventClick,
      onEventCreate: handleEventCreate,
      onEventUpdate: onEventUpdate,
    };

    switch (currentView) {
      case 'day':
        return (
          <DayView
            {...commonProps}
            startHour={mergedConfig.startHour!}
            endHour={mergedConfig.endHour!}
            hourHeight={mergedConfig.hourHeight!}
          />
        );
      case 'week':
        return (
          <WeekView
            {...commonProps}
            startHour={mergedConfig.startHour!}
            endHour={mergedConfig.endHour!}
            hourHeight={mergedConfig.hourHeight!}
          />
        );
      case 'month':
        return (
          <MonthView
            {...commonProps}
            onDateClick={handleDateClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn("cerberus-calendar-container h-full flex flex-col bg-white border rounded-lg overflow-hidden", className)}
      style={{
        backgroundColor: mergedConfig.theme?.background,
        borderColor: mergedConfig.theme?.border
      }}
    >
      <CalendarHeader
        currentDate={currentDate}
        view={currentView}
        availableViews={mergedConfig.availableViews!}
        enableNavigation={mergedConfig.enableNavigation!}
        enableViewSelector={mergedConfig.enableViewSelector!}
        theme={mergedConfig.theme}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        event={selectedEvent}
        defaultStart={eventModalDefaults.start}
        defaultEnd={eventModalDefaults.end}
        defaultAllDay={eventModalDefaults.allDay}
        theme={mergedConfig.theme}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleEventSave}
        onDelete={onEventDelete}
      />
    </div>
  );
};

export default Calendar;
