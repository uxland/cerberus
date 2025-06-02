# Ejemplo de uso de Cerberus Calendar

Este es un ejemplo completo de cómo usar la librería `@uxland/cerberus-calendar` en una aplicación React.

## 1. Instalar la librería

Si publicas la librería en npm:
```bash
npm install @uxland/cerberus-calendar
```

O si quieres usarla localmente:
```bash
# Desde el directorio de la librería
npm run build:lib
npm pack

# En tu aplicación nueva
npm install ../path/to/uxland-cerberus-calendar-1.0.0.tgz
```

## 2. Ejemplo completo

```tsx
// App.tsx
import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarEvent, 
  CalendarView, 
  CalendarConfig,
  cerberusTheme 
} from '@uxland/cerberus-calendar';

// Importar los estilos CSS
import '@uxland/cerberus-calendar/dist/style.css';

function App() {
  // Estado para los eventos
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión importante',
      description: 'Reunión con el equipo de desarrollo',
      start: new Date(2024, 11, 28, 9, 0),
      end: new Date(2024, 11, 28, 10, 30),
      backgroundColor: '#3b82f6',
    },
    {
      id: '2',
      title: 'Almuerzo de trabajo',
      description: 'Almuerzo con cliente',
      start: new Date(2024, 11, 28, 13, 0),
      end: new Date(2024, 11, 28, 14, 30),
      backgroundColor: '#10b981',
    },
    {
      id: '3',
      title: 'Conferencia',
      description: 'Conferencia de tecnología',
      start: new Date(2024, 11, 29, 0, 0),
      end: new Date(2024, 11, 29, 23, 59),
      allDay: true,
      backgroundColor: '#f59e0b',
    },
  ]);

  // Estado para la fecha y vista actuales
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [useCerberusTheme, setUseCerberusTheme] = useState(false);

  // Configuración del calendario
  const config: CalendarConfig = {
    enableEventCreation: true,
    enableViewSelector: true,
    enableNavigation: true,
    enableDragDrop: true,
    enableResize: true,
    defaultView: 'week',
    availableViews: ['day', 'week', 'month'],
    startHour: 7,
    endHour: 22,
    hourHeight: 60,
    theme: useCerberusTheme ? cerberusTheme : undefined,
  };

  // Handlers para eventos
  const handleEventCreate = (start: Date, end: Date, allDay?: boolean) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'Nuevo evento',
      description: 'Descripción del evento',
      start,
      end,
      allDay,
      backgroundColor: '#8b5cf6',
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

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Click en evento:', event);
    // Aquí puedes abrir un modal, navegar, etc.
  };

  return (
    <div style={{ 
      height: '100vh', 
      padding: '20px',
      backgroundColor: useCerberusTheme ? '#1A1A1A' : '#f9fafb'
    }}>
      <h1 style={{ 
        color: useCerberusTheme ? '#FFFFFF' : '#111827',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Mi Aplicación con Cerberus Calendar
      </h1>
      
      {/* Control para cambiar tema */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setUseCerberusTheme(!useCerberusTheme)}
          style={{
            padding: '10px 20px',
            backgroundColor: useCerberusTheme ? '#FDB813' : '#3b82f6',
            color: useCerberusTheme ? '#1A1A1A' : '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {useCerberusTheme ? 'Usar Tema Normal' : 'Usar Tema Cerberus'}
        </button>
      </div>

      {/* Información del estado */}
      <div style={{ 
        marginBottom: '20px', 
        textAlign: 'center',
        color: useCerberusTheme ? '#B0B0B0' : '#6b7280'
      }}>
        <p>Eventos: {events.length} | Vista: {currentView} | Fecha: {currentDate.toLocaleDateString()}</p>
      </div>

      {/* El componente Calendar */}
      <div style={{ height: '600px' }}>
        <Calendar
          events={events}
          config={config}
          currentDate={currentDate}
          view={currentView}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onEventClick={handleEventClick}
          onDateChange={setCurrentDate}
          onViewChange={setCurrentView}
        />
      </div>
    </div>
  );
}

export default App;
```

## 3. Configuración del proyecto

### package.json
```json
{
  "name": "mi-app-con-calendar",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@uxland/cerberus-calendar": "^1.0.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.462.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  }
}
```

### Si usas Tailwind CSS (recomendado)

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@uxland/cerberus-calendar/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 4. Funcionalidades disponibles

- ✅ Crear eventos haciendo click y arrastrando
- ✅ Editar eventos con drag & drop
- ✅ Redimensionar eventos
- ✅ Eliminar eventos
- ✅ Cambiar entre vistas (día, semana, mes)
- ✅ Navegar por fechas
- ✅ Tema personalizable (incluye tema Cerberus)
- ✅ Eventos de todo el día
- ✅ Eventos superpuestos
- ✅ Responsive design

## 5. Personalización avanzada

```tsx
// Tema personalizado
const miTemaPersonalizado = {
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
  background: '#ffffff',
  surface: '#f8f9fa',
  border: '#dee2e6',
  text: {
    primary: '#212529',
    secondary: '#6c757d',
    muted: '#adb5bd',
  },
  event: {
    background: '#ff6b6b',
    border: '#ff5252',
    text: '#ffffff',
  },
  header: {
    background: '#ffffff',
    text: '#212529',
  },
  grid: {
    lines: '#f1f3f4',
    hourLines: '#e9ecef',
  },
  selection: {
    background: 'rgba(255, 107, 107, 0.1)',
    border: '#ff6b6b',
  },
};

const config = {
  theme: miTemaPersonalizado,
  startHour: 8,
  endHour: 20,
  hourHeight: 80,
  // ... más configuraciones
};
```
