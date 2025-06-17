
import React from 'react';
import { CalendarEvent, CalendarTheme } from '../types/calendar';
import { getMonthDays, getEventsForDate, formatDate } from '../utils/calendar';
import { isSameMonth, isToday } from 'date-fns';
import { cn } from '../lib/utils';
import { useScrollbarWidth } from '../hooks/use-scrollbar-width';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  theme?: CalendarTheme;
  enableEventCreation: boolean;
  enableEventEditing: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (start: Date, end: Date, allDay?: boolean) => void;
  onDateClick?: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  theme,
  enableEventCreation,
  enableEventEditing,
  onEventClick,
  onEventCreate,
  onDateClick,
}) => {
  const monthDays = getMonthDays(date);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const scrollbarWidth = useScrollbarWidth(theme);

  const handleDayClick = (day: Date) => {
    if (onDateClick) {
      onDateClick(day);
    }
  };

  const handleAddEventClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    if (enableEventCreation && onEventCreate) {
      const startTime = new Date(day);
      startTime.setHours(0, 0, 0, 0);
      const endTime = new Date(day);
      endTime.setHours(23, 59, 59, 999);
      onEventCreate(startTime, endTime, true);
    }
  };  const renderWeeks = () => {
    const weeks = [];
    const weeksCount = Math.ceil(monthDays.length / 7);
    
    for (let i = 0; i < monthDays.length; i += 7) {
      const week = monthDays.slice(i, i + 7);
      weeks.push(
        <div 
          key={i} 
          className="grid grid-cols-7 border-b flex-1" 
          style={{ 
            borderColor: theme?.border
          }}
        >
          {week.map((day, index) => {
            const dayEvents = getEventsForDate(events, day);
            const isCurrentMonth = isSameMonth(day, date);
            const isTodayDate = isToday(day);

            return (              <div
                key={index}
                className={cn(
                  "p-2 border-r cursor-pointer transition-colors relative group flex flex-col",
                  !isCurrentMonth && "opacity-60"
                )}
                style={{
                  borderColor: theme?.border,
                  backgroundColor: isCurrentMonth ? 'transparent' : (theme?.surface || '#f8fafc'),
                  color: isCurrentMonth ? (theme?.text?.primary || '#1e293b') : (theme?.text?.muted || '#94a3b8')
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = theme?.selection?.background || '#dbeafe';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => handleDayClick(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isTodayDate && "rounded-full w-6 h-6 flex items-center justify-center"
                )}
                  style={{
                    backgroundColor: isTodayDate ? theme?.primary : 'transparent',
                    color: isTodayDate ? (theme?.event?.text || '#ffffff') : 'inherit'
                  }}>
                  {formatDate(day, 'd')}
                </div>                <div className="space-y-1 flex-1 overflow-y-auto">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="p-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: event.backgroundColor || theme?.event?.background || '#3b82f6',
                        color: event.textColor || theme?.event?.text || '#ffffff'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {event.allDay ? event.title : `${formatDate(event.start, 'HH:mm')} ${event.title}`}
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme?.text?.secondary || '#64748b' }}
                    >
                      +{dayEvents.length - 3} más
                    </div>
                  )}

                  {/* Botón flotante para agregar evento - visible al hacer hover */}
                  {enableEventCreation && isCurrentMonth && (
                    <button
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:shadow-lg z-10"
                      style={{
                        color: theme?.primary || '#3b82f6',
                        borderColor: theme?.primary || '#3b82f6'
                      }}
                      onClick={(e) => handleAddEventClick(day, e)}
                      title="Agregar evento"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return weeks;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week Headers */}
      <div className="flex">
        <div
          className="flex-1 grid grid-cols-7 border-b"
          style={{ borderColor: theme?.border }}
        >
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="p-3 text-center text-sm font-medium border-r"
              style={{
                borderColor: theme?.border,
                color: theme?.header?.text || '#6b7280',
                backgroundColor: theme?.header?.background || 'transparent'
              }}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Espacio reservado para la scrollbar - dinámico */}
        {/* <div
          className="flex-shrink-0 border-b"
          style={{
            width: `${scrollbarWidth}px`,
            borderColor: theme?.border,
            backgroundColor: theme?.header?.background
          }}
        ></div> */}
      </div>      {/* Month Grid */}
      <div className={cn(
        "flex-1 overflow-hidden flex flex-col calendar-scrollbar",
        theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
      )}>
        <div className="flex-1 flex flex-col">
          {renderWeeks()}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
