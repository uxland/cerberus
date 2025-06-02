export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  event: {
    background: string;
    border: string;
    text: string;
  };
  header: {
    background: string;
    text: string;
  };
  grid: {
    lines: string;
    hourLines: string;
  };
  selection: {
    background: string;
    border: string;
  };
  cssVariables?: Record<string, string>;
}

export interface CalendarConfig {
  enableEventCreation?: boolean;
  enableEventEditing?: boolean;
  enableViewSelector?: boolean;
  enableNavigation?: boolean;
  enableDragDrop?: boolean;
  enableResize?: boolean;
  defaultView?: CalendarView;
  availableViews?: CalendarView[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
  theme?: CalendarTheme;
}

export interface CalendarProps {
  events: CalendarEvent[];
  config?: CalendarConfig;
  currentDate?: Date;
  view?: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (start: Date, end: Date, allDay?: boolean, eventData?: Partial<CalendarEvent>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  className?: string;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  date: Date;
}
