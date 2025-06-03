# @uxland/cerberus-scheduler

A powerful and flexible React calendar/scheduler component with support for multiple views, themes, and event management.

## Features

- 📅 Multiple view types: Day, Week, Month
- 🎨 Themeable with built-in Cerberus theme
- 📱 Responsive design with mobile support
- 🎯 Event creation, editing, and deletion
- 🔄 Drag & drop event management
- ⏰ Real-time current time indicator
- 🎨 Customizable event colors
- 🌙 Dark mode support
- ♿ Accessibility compliant
- 📦 TypeScript support

## Installation

```bash
npm install @uxland/cerberus-scheduler
```

### Peer Dependencies

This component requires the following peer dependencies:

```bash
npm install react react-dom @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-switch class-variance-authority clsx date-fns lucide-react tailwind-merge
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { Calendar, CalendarEvent } from '@uxland/cerberus-scheduler';
// Los estilos se importan automáticamente con el componente

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      backgroundColor: '#3b82f6'
    }
  ]);

  const handleEventCreate = (start: Date, end: Date, allDay?: boolean) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'New Event',
      start,
      end,
      allDay,
      backgroundColor: '#10b981'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        events={events}
        onEventCreate={handleEventCreate}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}

export default App;
```

## Configuration

### Calendar Props

```tsx
interface CalendarProps {
  events?: CalendarEvent[];
  config?: Partial<CalendarConfig>;
  currentDate?: Date;
  view?: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (start: Date, end: Date, allDay?: boolean, data?: any) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  className?: string;
}
```

### Calendar Configuration

```tsx
interface CalendarConfig {
  enableEventCreation: boolean;
  enableEventEditing: boolean;
  enableViewSelector: boolean;
  enableNavigation: boolean;
  enableDragDrop: boolean;
  enableResize: boolean;
  defaultView: CalendarView;
  availableViews: CalendarView[];
  startHour: number;
  endHour: number;
  hourHeight: number;
  theme: CalendarTheme;
}
```

## Theming

### Using the Cerberus Theme

```tsx
import { Calendar, cerberusTheme } from '@uxland/cerberus-scheduler';

<Calendar
  events={events}
  config={{ theme: cerberusTheme }}
/>
```

### Custom Theme

```tsx
const customTheme = {
  primary: '#8b5cf6',
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
    background: '#8b5cf6',
    border: '#7c3aed',
    text: '#ffffff',
  },
  // ... more theme properties
};

<Calendar
  events={events}
  config={{ theme: customTheme }}
/>
```

## Event Types

```tsx
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: any;
}
```

## Views

- **Day View**: Shows a single day with hourly time slots
- **Week View**: Shows a week with all days visible
- **Month View**: Shows a full month in grid format

## Styling

The component comes with pre-built styles that are automatically imported when you use the component.

No need to manually import CSS files - everything is handled internally.

Make sure you have Tailwind CSS configured in your project for optimal styling.

## Advanced Usage

### Controlled Date and View

```tsx
const [currentDate, setCurrentDate] = useState(new Date());
const [currentView, setCurrentView] = useState<CalendarView>('week');

<Calendar
  events={events}
  currentDate={currentDate}
  view={currentView}
  onDateChange={setCurrentDate}
  onViewChange={setCurrentView}
/>
```

### Custom Event Handling

```tsx
const handleEventClick = (event: CalendarEvent) => {
  console.log('Event clicked:', event);
  // Custom logic for event clicks
};

<Calendar
  events={events}
  onEventClick={handleEventClick}
  config={{
    enableEventEditing: false // Disable built-in editing
  }}
/>
```

## TypeScript Support

This package is written in TypeScript and includes comprehensive type definitions. All types are exported for use in your application:

```tsx
import type {
  CalendarEvent,
  CalendarView,
  CalendarTheme,
  CalendarConfig,
  CalendarProps
} from '@uxland/cerberus-scheduler';
```

## License

MIT License - see LICENSE file for details.

## Development Status

✅ **Component extraction completed successfully**
- All calendar components have been extracted and configured
- Import paths have been updated for standalone usage
- TypeScript compilation verified without errors
- Package structure is ready for distribution

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/uxland/cerberus-scheduler/issues) page.
