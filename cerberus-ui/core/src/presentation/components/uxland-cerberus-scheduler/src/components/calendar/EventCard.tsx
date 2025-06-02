import React, { useState } from 'react';
import { CalendarEvent, CalendarTheme } from '@/types/calendar';
import { formatDate } from '@/utils/calendar';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  theme?: CalendarTheme;
  style?: React.CSSProperties;
  className?: string;
  isDragging?: boolean;
  isResizing?: boolean;
  layout?: {
    left: number;
    width: number;
    zIndex: number;
  };
  onEventClick?: (event: CalendarEvent) => void;
  onDragStart?: (e: React.DragEvent, event: CalendarEvent) => void;
  onResizeStart?: (e: React.MouseEvent, event: CalendarEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  theme,
  style,
  className,
  isDragging = false,
  isResizing = false,
  layout,
  onEventClick,
  onDragStart,
  onResizeStart,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const eventStyle = {
    backgroundColor: event.backgroundColor || theme?.event?.background || '#3b82f6',
    borderColor: event.backgroundColor || theme?.event?.border || '#2563eb',
    color: event.textColor || theme?.event?.text || '#ffffff',
    left: layout ? `${layout.left}%` : '0%',
    width: layout ? `${layout.width}%` : '98%',
    // Z-index dinámico: mayor en hover para sobreponerse al indicador de tiempo (z-[40])
    zIndex: isHovered ? 50 : (layout?.zIndex || 1),
    ...style,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart?.(e, event);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResizeStart?.(e, event);
  };

  return (
    <div
      className={cn(
        "absolute border-l-4 px-2 py-1 text-xs rounded-r shadow-sm",
        "cursor-pointer select-none transition-all duration-150",
        "hover:shadow-md hover:brightness-110",
        "border border-opacity-20 border-white", // Borde sutil para separación visual
        isDragging && "opacity-50 shadow-lg",
        isResizing && "ring-2 ring-blue-400",
        className
      )}
      style={eventStyle}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-medium truncate" style={{ lineHeight: '1.2' }}>
        {event.title}
      </div>
      {!event.allDay && (
        <div className="text-xs opacity-90" style={{ lineHeight: '1.1' }}>
          {formatDate(event.start, 'HH:mm')} - {formatDate(event.end, 'HH:mm')}
        </div>
      )}
      {event.description && (
        <div className="text-xs opacity-75 truncate mt-1" style={{ lineHeight: '1.1' }}>
          {event.description}
        </div>
      )}

      {/* Resize handle */}
      {/* {isHovered && !event.allDay && (
        <div
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 hover:opacity-100"
          style={{ overflow: 'hidden' }}
          onMouseDown={handleResizeStart}
        >
          <div className="h-1 bg-white bg-opacity-50 rounded-full mx-2"></div>
        </div>
      )} */}
    </div>
  );
};

export default EventCard;
