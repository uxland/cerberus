// Import styles automatically when using the component
import './styles.css';

// Main components
export { default as Calendar } from './components/Calendar';
export { default as CalendarHeader } from './components/CalendarHeader';
export { default as DayView } from './components/DayView';
export { default as WeekView } from './components/WeekView';
export { default as MonthView } from './components/MonthView';
export { default as EventModal } from './components/EventModal';
export { default as EventCard } from './components/EventCard';
export { default as CurrentTimeIndicator } from './components/CurrentTimeIndicator';

// Alias for main component
export { default as Scheduler } from './components/Calendar';

// UI Components
export * from './components/ui/button';
export * from './components/ui/dialog';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/select';
export * from './components/ui/textarea';
export * from './components/ui/switch';

// Types
export type {
  CalendarEvent,
  CalendarView,
  CalendarTheme,
  CalendarConfig,
  CalendarProps,
  TimeSlot
} from './types/calendar';

// Themes
export { cerberusTheme } from './themes/cerberus';

// Utilities
export * from './utils/calendar';
export * from './utils/eventOverlap';

// Hooks
export * from './hooks/use-current-time';
export * from './hooks/use-scrollbar-width';

// Utils
export * from './lib/utils';
