
import React, { useState, useRef } from 'react';
import { CalendarEvent, CalendarTheme, TimeSlot } from '../types/calendar';
import { generateTimeSlots, getEventsForDate, getEventPosition, getDateFromPosition, snapToGrid } from '../utils/calendar';
import { formatDate } from '../utils/calendar';
import { calculateEventLayout } from '../utils/eventOverlap';
import EventCard from './EventCard';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import { useCurrentTime } from '../hooks/use-current-time';
import { useDynamicHourHeight } from '../hooks/use-dynamic-hour-height';
import { cn } from '../lib/utils';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
  hourHeight: number;
  theme?: CalendarTheme;
  enableEventCreation: boolean;
  enableEventEditing: boolean;
  enableDragDrop: boolean;
  enableResize: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (start: Date, end: Date, allDay?: boolean) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  startHour,
  endHour,
  hourHeight,
  theme,
  enableEventCreation,
  enableEventEditing,
  enableDragDrop,
  enableResize,
  onEventClick,
  onEventCreate,
  onEventUpdate,
}) => {  const containerRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStart, setCreationStart] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const currentTime = useCurrentTime();
    // Calcular altura dinámica basada en el espacio disponible
  const { hourHeight: dynamicHourHeight, shouldFillContainer } = useDynamicHourHeight(startHour, endHour, hourHeight, containerRef);

  const timeSlots = generateTimeSlots(startHour, endHour, 60);
  const dayEvents = getEventsForDate(events, date);
  const allDayEvents = dayEvents.filter(event => event.allDay);
  const timedEvents = dayEvents.filter(event => !event.allDay);

  // Calcular layout para eventos con superposición usando altura dinámica
  const eventLayouts = calculateEventLayout(timedEvents);

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (!enableEventCreation) return;

    const startTime = new Date(date);
    startTime.setHours(slot.hour, slot.minute, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    onEventCreate?.(startTime, endTime, false);
  };

  const handleAllDayClick = () => {
    if (!enableEventCreation) return;

    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(23, 59, 59, 999);

    onEventCreate?.(startTime, endTime, true);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    if (!enableDragDrop) return;
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slot: TimeSlot) => {
    e.preventDefault();
    if (!draggedEvent || !enableDragDrop) return;

    const newStart = new Date(date);
    newStart.setHours(slot.hour, slot.minute, 0, 0);

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    const updatedEvent = {
      ...draggedEvent,
      start: newStart,
      end: newEnd
    };

    onEventUpdate?.(updatedEvent);
    setDraggedEvent(null);
  };
  return (
    <div className="flex flex-col h-full" ref={containerRef} data-calendar-container>
      {/* All Day Events Section */}
      {(allDayEvents.length > 0 || enableEventCreation) && (
        <div
          className={cn(
            "border-b p-2 min-h-[60px] max-h-32 overflow-y-auto calendar-scrollbar",
            theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
          )}
          style={{
            backgroundColor: theme?.surface,
            borderColor: theme?.border,
            color: theme?.text?.primary
          }}
          data-calendar-header
        >
          <div className="text-xs font-medium mb-2" style={{ color: theme?.text?.secondary }}>
            Todo el día
          </div>
          <div className="space-y-1">
            {allDayEvents.map(event => (
              <div
                key={event.id}
                className="p-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: event.backgroundColor || theme?.event?.background || '#3b82f6',
                  color: event.textColor || theme?.event?.text || '#ffffff'
                }}
                onClick={() => onEventClick?.(event)}
              >
                {event.title}
              </div>
            ))}
            {enableEventCreation && (
              <div
                className="border border-dashed rounded cursor-pointer hover:border-opacity-60 hover:bg-opacity-5 transition-all duration-200 text-xs flex items-center justify-center h-6 mx-1"
                style={{
                  borderColor: theme?.border,
                  color: theme?.text?.muted
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.primary + '10' || '#3b82f610';
                  e.currentTarget.style.borderColor = theme?.primary + '40' || '#3b82f640';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = theme?.border || '#e5e7eb';
                }}
                onClick={handleAllDayClick}
              >
                +
              </div>
            )}
          </div>
        </div>
      )}      {/* Time Slots */}
      <div className={cn(
        "flex-1 overflow-auto calendar-scrollbar",
        theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
      )}>
        <div 
          className="relative"
          style={{ height: `${timeSlots.length * dynamicHourHeight}px` }}
        >
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="relative flex"
              style={{
                height: `${dynamicHourHeight}px`,
                borderBottom: `1px solid ${theme?.grid?.lines || '#f1f5f9'}`,
                backgroundColor: theme?.background
              }}
              onClick={() => handleTimeSlotClick(slot)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slot)}
            >
              <div
                className="w-16 p-2 text-xs flex-shrink-0"
                style={{
                  borderRight: `1px solid ${theme?.grid?.lines || '#f1f5f9'}`,
                  backgroundColor: theme?.surface || theme?.background,
                  color: theme?.text?.muted
                }}
              >
                {slot.minute === 0 && formatDate(slot.date, 'HH:mm')}
              </div>
              <div
                className="flex-1 relative cursor-pointer transition-colors hover:bg-opacity-50"
                style={{ backgroundColor: 'transparent' }}
              >
                {enableEventCreation && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center">
                    <span className="text-xs" style={{ color: theme?.text?.muted }}>
                      + Crear evento
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Timed Events with Overlap Layout */}
          <div className="absolute top-0 left-16 right-0">            {/* Indicador de hora actual */}
            <CurrentTimeIndicator
              currentTime={currentTime}
              startHour={startHour}
              hourHeight={dynamicHourHeight}
              theme={theme}
              showTimeLabel={true}
            />

            {eventLayouts.map(({ event, left, width, zIndex }) => {
              const position = getEventPosition(event, startHour, dynamicHourHeight);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  theme={theme}
                  style={{
                    top: `${position.top}px`,
                    height: `${Math.max(position.height - 2, 28)}px`, // Reducir altura para crear separación
                    marginBottom: '2px', // Espaciado entre eventos
                  }}
                  layout={{ left, width, zIndex }}
                  onEventClick={onEventClick}
                  onDragStart={handleDragStart}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
