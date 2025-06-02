# Cerberus Calendar

Un componente de calendario altamente configurable para React con vistas diaria, semanal y mensual.

## Características

- 📅 Vistas múltiples: día, semana y mes
- 🎨 Temas personalizables (incluye tema Cerberus)
- ✨ Drag & Drop para eventos
- 🔄 Redimensionamiento de eventos
- 📱 Responsive design
- 🚀 TypeScript completo
- 🎯 API simple y flexible

## Instalación

```bash
npm install @uxland/cerberus-calendar
```

o

```bash
yarn add @uxland/cerberus-calendar
```

o

```bash
pnpm add @uxland/cerberus-calendar
```

## Uso básico

```tsx
import React, { useState } from 'react';
import { Calendar, CalendarEvent, CalendarView } from '@uxland/cerberus-calendar';
import '@uxland/cerberus-calendar/styles';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      description: 'Reunión semanal del equipo',
      start: new Date(2024, 11, 28, 9, 0),
      end: new Date(2024, 11, 28, 10, 30),
      backgroundColor: '#3b82f6',
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('week');

  const handleEventCreate = (start: Date, end: Date, allDay?: boolean) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'Nuevo evento',
      start,
      end,
      allDay,
      backgroundColor: '#3b82f6',
    };
    setEvents([...events, newEvent]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        events={events}
        currentDate={currentDate}
        view={currentView}
        onEventCreate={handleEventCreate}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onDateChange={setCurrentDate}
        onViewChange={setCurrentView}
      />
    </div>
  );
}

export default App;
```

## Configuración avanzada

```tsx
import { Calendar, CalendarConfig, cerberusTheme } from '@uxland/cerberus-calendar';

const config: CalendarConfig = {
  enableEventCreation: true,
  enableEventEditing: true,
  enableViewSelector: true,
  enableNavigation: true,
  enableDragDrop: true,
  enableResize: true,
  defaultView: 'week',
  availableViews: ['day', 'week', 'month'],
  startHour: 7,
  endHour: 22,
  hourHeight: 60,
  theme: cerberusTheme, // Usar tema Cerberus
};

<Calendar
  events={events}
  config={config}
  // ... otras props
/>
```

### Control de Edición de Eventos

El componente ofrece control granular sobre la edición de eventos a través de la propiedad `enableEventEditing` y el callback `onEventClick`:

#### Caso 1: Calendario de solo lectura
```tsx
const config = {
  enableEventCreation: false,
  enableEventEditing: false,
};

<Calendar
  events={events}
  config={config}
  // No se pueden crear ni editar eventos
/>
```

#### Caso 2: Manejo personalizado de clics en eventos
```tsx
const handleEventClick = (event: CalendarEvent) => {
  // Lógica personalizada: abrir modal personalizado, navegar, etc.
  console.log('Evento clickeado:', event);
  // No se abre el modal de edición por defecto
};

<Calendar
  events={events}
  config={{ enableEventEditing: true }}
  onEventClick={handleEventClick}
/>
```

#### Caso 3: Edición completa (comportamiento por defecto)
```tsx
<Calendar
  events={events}
  config={{ enableEventEditing: true }}
  onEventUpdate={handleEventUpdate}
  onEventDelete={handleEventDelete}
  // Se abre el modal de edición al hacer clic en eventos
/>
```

## API

### Props del Calendar

| Prop | Tipo | Descripción |
|------|------|-------------|
| `events` | `CalendarEvent[]` | Array de eventos a mostrar |
| `currentDate` | `Date` | Fecha actual del calendario |
| `view` | `CalendarView` | Vista actual ('day', 'week', 'month') |
| `config` | `CalendarConfig` | Configuración del calendario |
| `onEventCreate` | `(start: Date, end: Date, allDay?: boolean) => void` | Callback al crear evento |
| `onEventUpdate` | `(event: CalendarEvent) => void` | Callback al actualizar evento |
| `onEventDelete` | `(eventId: string) => void` | Callback al eliminar evento |
| `onEventClick` | `(event: CalendarEvent) => void` | Callback al hacer click en evento |
| `onDateChange` | `(date: Date) => void` | Callback al cambiar fecha |
| `onViewChange` | `(view: CalendarView) => void` | Callback al cambiar vista |

### Tipos

```tsx
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  backgroundColor?: string;
}

type CalendarView = 'day' | 'week' | 'month';

interface CalendarConfig {
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
```

## Temas

El componente incluye un tema por defecto y el tema Cerberus:

```tsx
import { cerberusTheme } from '@uxland/cerberus-calendar';

// Usar tema Cerberus
const config = {
  theme: cerberusTheme
};

// O crear tema personalizado
const customTheme = {
  primary: '#your-color',
  secondary: '#your-color',
  // ... más configuraciones
};
```

## Desarrollo

Para contribuir al proyecto:

```bash
# Clonar el repositorio
git clone https://github.com/uxland/cerberus-calendar.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir la librería
npm run build:lib
```

## Licencia

MIT
