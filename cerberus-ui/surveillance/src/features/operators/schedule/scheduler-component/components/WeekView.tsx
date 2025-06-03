import React, { useState } from 'react';
import { CalendarEvent, CalendarTheme } from '../types/calendar';
import { getWeekDays, generateTimeSlots, getEventsForDate, getEventPosition, formatDate } from '../utils/calendar';
import { calculateEventLayout } from '../utils/eventOverlap';
import EventCard from './EventCard';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import { useCurrentTime } from '../hooks/use-current-time';
import { cn } from '../lib/utils';
import { useScrollbarWidth } from '../hooks/use-scrollbar-width';

interface WeekViewProps {
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

const WeekView: React.FC<WeekViewProps> = ({
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
}) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const scrollbarWidth = useScrollbarWidth(theme);
  const currentTime = useCurrentTime();

  const weekDays: Date[] = getWeekDays(date);
  const timeSlots = generateTimeSlots(startHour, endHour, 60);

  const handleTimeSlotClick = (day: Date, hour: number, minute: number = 0) => {
    if (!enableEventCreation) return;

    const startTime = new Date(day);
    startTime.setHours(hour, minute, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    onEventCreate?.(startTime, endTime, false);
  };

  const handleAllDayClick = (day: Date) => {
    if (!enableEventCreation) return;

    const startTime = new Date(day);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(day);
    endTime.setHours(23, 59, 59, 999);

    onEventCreate?.(startTime, endTime, true);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    if (!enableDragDrop) return;
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getEventPosition = (event: CalendarEvent, day: Date, startHour: number, hourHeight: number) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Verificar si el evento pertenece al día actual
    if (eventStart.getDate() !== day.getDate() || eventEnd.getDate() !== day.getDate()) {
      return { top: 0, height: 0 };
    }

    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
    const startHourMinutes = startHour * 60;

    const top = ((startMinutes - startHourMinutes) / 60) * hourHeight;
    const height = ((endMinutes - startMinutes) / 60) * hourHeight;

    return { top: Math.max(0, top), height: Math.max(30, height) };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week Header */}
      <div style={{ borderBottom: `1px solid ${theme?.border}`, backgroundColor: theme?.header?.background }}>
        <div className="flex">
          {/* Espacio para columna de horas */}
          <div
            className="w-16 flex-shrink-0"
            style={{ borderRight: `1px solid ${theme?.border}`, borderBottom: `1px solid ${theme?.border}` }}
          ></div>

          {/* Headers de días */}
          <div className="flex-1 flex">
            <div className="flex-1 flex">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 p-3 text-center"
                  style={{
                    borderRight: index === weekDays.length - 1 ? undefined : `1px solid ${theme?.border}`,
                    borderBottom: `1px solid ${theme?.border}`,
                    color: theme?.header?.text
                  }}
                >
                  <div className="text-sm font-medium">
                    {formatDate(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "text-lg font-semibold mt-1",
                    new Date().toDateString() === day.toDateString() && "rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  )}
                    style={{
                      backgroundColor: new Date().toDateString() === day.toDateString() ? theme?.primary : 'transparent',
                      color: new Date().toDateString() === day.toDateString() ? theme?.event?.text : theme?.header?.text
                    }}>
                    {formatDate(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
            {/* Espacio reservado para la scrollbar - dinámico */}
            <div
              className="flex-shrink-0"
              style={{
                width: `${scrollbarWidth}px`,
                borderBottom: `1px solid ${theme?.border}`
              }}
            ></div>
          </div>
        </div>

        {/* All Day Events Row */}
        <div className="flex">
          {/* Espacio para columna de horas */}
          <div
            className="w-16 flex-shrink-0 p-2 text-xs"
            style={{
              borderRight: `1px solid ${theme?.border}`,
              color: theme?.text?.muted
            }}
          >
            Todo el día
          </div>

          {/* Eventos de todo el día */}
          <div className="flex-1 flex">
            <div className="flex-1 flex">
              {weekDays.map((day, dayIndex) => {
                const allDayEvents = getEventsForDate(events, day).filter(event => event.allDay);
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "flex-1 min-h-[50px] max-h-32 relative",
                      theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
                    )}
                    style={{
                      borderRight: dayIndex === weekDays.length - 1 ? undefined : `1px solid ${theme?.border}`
                    }}
                  >
                    <div
                      className={cn(
                        "h-full overflow-y-auto calendar-scrollbar",
                        theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
                      )}
                      style={{
                        paddingRight: '1px' // Pequeño padding para evitar que el contenido toque el borde
                      }}
                    >
                      <div className="p-1">
                        {allDayEvents.map(event => (
                          <div
                            key={event.id}
                            className="mb-1 p-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
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
                            onClick={() => handleAllDayClick(day)}
                          >
                            +
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Espacio reservado para la scrollbar - dinámico */}
            <div
              className="flex-shrink-0"
              style={{ width: `${scrollbarWidth}px` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Time Grid Container with synchronized scroll */}
      <div className="flex-1 overflow-hidden">
        {/* Contenedor con scroll que incluye horas y días */}
        <div
          className={cn(
            "h-full overflow-auto calendar-scrollbar",
            theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default'
          )}
        >
          <div
            className="flex"
            style={{ minHeight: `${timeSlots.length * hourHeight}px` }}
          >
            {/* Columna de horas (sincronizada con scroll) */}
            <div
              className="flex flex-col flex-shrink-0 w-16"
              style={{
                borderRight: `1px solid ${theme?.grid?.lines || theme?.border}`,
                backgroundColor: theme?.surface || theme?.background
              }}
            >
              {timeSlots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="p-2 text-xs flex-shrink-0"
                  style={{
                    height: `${hourHeight}px`,
                    borderBottom: `1px solid ${theme?.grid?.lines || '#f1f5f9'}`,
                    color: theme?.text?.muted
                  }}
                >
                  {slot.minute === 0 && formatDate(slot.date, 'HH:mm')}
                </div>
              ))}
            </div>

            {/* Contenedor de días con flex */}
            <div className="flex-1 flex relative">
              {weekDays.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="flex-1 relative"
                  style={{
                    borderRight: dayIndex === weekDays.length - 1 ? undefined : `1px solid ${theme?.grid?.lines || '#f1f5f9'}`
                  }}
                >
                  {/* Celdas de tiempo */}
                  {timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="cursor-pointer transition-colors relative hover:bg-opacity-10"
                      style={{
                        height: `${hourHeight}px`,
                        borderBottom: `1px solid ${theme?.grid?.lines || '#f1f5f9'}`,
                        backgroundColor: 'transparent'
                      }}
                      onClick={() => handleTimeSlotClick(day, slot.hour, slot.minute)}
                    >
                      {enableEventCreation && (
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center">
                          <span className="text-xs" style={{ color: theme?.text?.muted }}>+</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Overlay de eventos para este día */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {(() => {
                      const dayEvents = getEventsForDate(events, day).filter(event => !event.allDay);
                      const eventLayouts = calculateEventLayout(dayEvents);
                      return eventLayouts.map(({ event, left, width, zIndex }) => {
                        const position = getEventPosition(event, day, startHour, hourHeight);
                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            theme={theme}
                            style={{
                              top: `${position.top}px`,
                              height: `${Math.max(position.height - 2, 28)}px`,
                              marginBottom: '2px',
                              pointerEvents: 'auto'
                            }}
                            layout={{ left, width, zIndex }}
                            onEventClick={onEventClick}
                            onDragStart={handleDragStart}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>
              ))}

              {/* Indicador de hora actual que se extiende por toda la semana */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <CurrentTimeIndicator
                  currentTime={currentTime}
                  startHour={startHour}
                  hourHeight={hourHeight}
                  theme={theme}
                  showTimeLabel={true}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
