import React, { useState } from 'react';
import Calendar from '@/components/calendar/Calendar';
import { CalendarEvent, CalendarView, CalendarConfig } from '@/types/calendar';
import { cerberusTheme } from '@/themes/cerberus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      description: 'Reunión semanal del equipo de desarrollo',
      start: new Date(2024, 11, 28, 9, 0),
      end: new Date(2024, 11, 28, 10, 30),
      backgroundColor: '#3b82f6',
    },
    {
      id: '2',
      title: 'Almuerzo con cliente',
      description: 'Reunión informal con cliente potencial',
      start: new Date(2024, 11, 28, 13, 0),
      end: new Date(2024, 11, 28, 14, 30),
      backgroundColor: '#10b981',
    },
    {
      id: '3',
      title: 'Conferencia Tech',
      description: 'Conferencia anual de tecnología',
      start: new Date(2024, 11, 29, 0, 0),
      end: new Date(2024, 11, 29, 23, 59),
      allDay: true,
      backgroundColor: '#f59e0b',
    },
    {
      id: '4',
      title: 'Revisión de código',
      description: 'Revisión del código del nuevo feature',
      start: new Date(2024, 11, 30, 15, 0),
      end: new Date(2024, 11, 30, 16, 0),
      backgroundColor: '#8b5cf6',
    },
    // Eventos superpuestos para probar el nuevo sistema
    {
      id: '5',
      title: 'Meeting superpuesto 1',
      description: 'Primer evento superpuesto',
      start: new Date(2024, 11, 28, 9, 30),
      end: new Date(2024, 11, 28, 10, 0),
      backgroundColor: '#ef4444',
    },
    {
      id: '6',
      title: 'Meeting superpuesto 2',
      description: 'Segundo evento superpuesto',
      start: new Date(2024, 11, 28, 9, 45),
      end: new Date(2024, 11, 28, 10, 15),
      backgroundColor: '#06b6d4',
    },
    // Caso de prueba específico: evento de 2h + dos eventos de 1h (debe usar solo 3 columnas)
    {
      id: '7',
      title: 'Evento largo (10-12)',
      description: 'Evento de 2 horas que se superpone con los otros dos',
      start: new Date(2024, 11, 28, 10, 0),
      end: new Date(2024, 11, 28, 12, 0),
      backgroundColor: '#8b5cf6',
    },
    {
      id: '8',
      title: 'Evento corto 1 (10-11)',
      description: 'Primer evento de 1 hora',
      start: new Date(2024, 11, 28, 10, 0),
      end: new Date(2024, 11, 28, 11, 0),
      backgroundColor: '#10b981',
    },
    {
      id: '9',
      title: 'Evento corto 2 (11-12)',
      description: 'Segundo evento de 1 hora',
      start: new Date(2024, 11, 28, 11, 0),
      end: new Date(2024, 11, 28, 12, 0),
      backgroundColor: '#f59e0b',
    },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [useCerberusTheme, setUseCerberusTheme] = useState(true);

  const [config, setConfig] = useState<CalendarConfig>({
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
    },
  });

  const currentTheme = useCerberusTheme ? cerberusTheme : config.theme;

  const handleEventCreate = (start: Date, end: Date, allDay?: boolean, eventData?: Partial<CalendarEvent>) => {
    // eventData puede venir del modal y contener backgroundColor, title, etc.
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventData?.title || 'Nuevo evento',
      description: eventData?.description || '',
      start,
      end,
      allDay,
      backgroundColor: eventData?.backgroundColor || currentTheme?.event?.background || '#3b82f6',
    };
    setEvents([...events, newEvent]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    console.log('Actualizar evento:', updatedEvent);
    setEvents(events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Eliminar evento:', eventId);
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Click en evento:', event);
  };

  const toggleFeature = (feature: keyof CalendarConfig) => {
    setConfig(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: useCerberusTheme ? '#1A1A1A' : '#f9fafb' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold" style={{ color: useCerberusTheme ? '#FFFFFF' : '#111827' }}>
            Calendario Scheduler
          </h1>
          <p className="text-lg" style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>
            Componente de calendario altamente configurable con vistas diaria, semanal y mensual
          </p>
        </div>

        {/* Theme Selector */}
        <Card style={{ backgroundColor: useCerberusTheme ? '#2D2D2D' : '#ffffff', borderColor: useCerberusTheme ? '#404040' : '#e5e7eb' }}>
          <CardHeader>
            <CardTitle style={{ color: useCerberusTheme ? '#FFFFFF' : '#111827' }}>Tema del Calendario</CardTitle>
            <CardDescription style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>
              Selecciona entre el tema por defecto y el tema Cerberus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={!useCerberusTheme ? "default" : "outline"}
                onClick={() => setUseCerberusTheme(false)}
                style={{
                  backgroundColor: !useCerberusTheme ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                  borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                  color: !useCerberusTheme ? '#ffffff' : (useCerberusTheme ? '#FFFFFF' : '#374151')
                }}
              >
                Tema por Defecto
              </Button>
              <Button
                variant={useCerberusTheme ? "default" : "outline"}
                onClick={() => setUseCerberusTheme(true)}
                style={{
                  backgroundColor: useCerberusTheme ? '#FDB813' : 'transparent',
                  borderColor: useCerberusTheme ? '#E6A500' : '#e5e7eb',
                  color: useCerberusTheme ? '#1A1A1A' : '#374151'
                }}
              >
                Tema Cerberus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controles de configuración */}
        <Card style={{ backgroundColor: useCerberusTheme ? '#2D2D2D' : '#ffffff', borderColor: useCerberusTheme ? '#404040' : '#e5e7eb' }}>
          <CardHeader>
            <CardTitle style={{ color: useCerberusTheme ? '#FFFFFF' : '#111827' }}>Configuración del Calendario</CardTitle>
            <CardDescription style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>
              Personaliza el comportamiento del calendario activando o desactivando funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Button
                  variant={config.enableEventCreation ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature('enableEventCreation')}
                  className="w-full"
                  style={{
                    backgroundColor: config.enableEventCreation ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                    borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                    color: config.enableEventCreation ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#FFFFFF' : '#374151')
                  }}
                >
                  Crear Eventos
                </Button>
                <Badge
                  variant={config.enableEventCreation ? "default" : "secondary"}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: config.enableEventCreation ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : (useCerberusTheme ? '#4A4A4A' : '#f3f4f6'),
                    color: config.enableEventCreation ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#B0B0B0' : '#6b7280')
                  }}
                >
                  {config.enableEventCreation ? "Activado" : "Desactivado"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  variant={config.enableViewSelector ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature('enableViewSelector')}
                  className="w-full"
                  style={{
                    backgroundColor: config.enableViewSelector ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                    borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                    color: config.enableViewSelector ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#FFFFFF' : '#374151')
                  }}
                >
                  Selector Vistas
                </Button>
                <Badge
                  variant={config.enableViewSelector ? "default" : "secondary"}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: config.enableViewSelector ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : (useCerberusTheme ? '#4A4A4A' : '#f3f4f6'),
                    color: config.enableViewSelector ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#B0B0B0' : '#6b7280')
                  }}
                >
                  {config.enableViewSelector ? "Activado" : "Desactivado"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  variant={config.enableNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature('enableNavigation')}
                  className="w-full"
                  style={{
                    backgroundColor: config.enableNavigation ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                    borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                    color: config.enableNavigation ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#FFFFFF' : '#374151')
                  }}
                >
                  Navegación
                </Button>
                <Badge
                  variant={config.enableNavigation ? "default" : "secondary"}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: config.enableNavigation ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : (useCerberusTheme ? '#4A4A4A' : '#f3f4f6'),
                    color: config.enableNavigation ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#B0B0B0' : '#6b7280')
                  }}
                >
                  {config.enableNavigation ? "Activado" : "Desactivado"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  variant={config.enableDragDrop ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature('enableDragDrop')}
                  className="w-full"
                  style={{
                    backgroundColor: config.enableDragDrop ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                    borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                    color: config.enableDragDrop ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#FFFFFF' : '#374151')
                  }}
                >
                  Arrastrar
                </Button>
                <Badge
                  variant={config.enableDragDrop ? "default" : "secondary"}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: config.enableDragDrop ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : (useCerberusTheme ? '#4A4A4A' : '#f3f4f6'),
                    color: config.enableDragDrop ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#B0B0B0' : '#6b7280')
                  }}
                >
                  {config.enableDragDrop ? "Activado" : "Desactivado"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  variant={config.enableResize ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature('enableResize')}
                  className="w-full"
                  style={{
                    backgroundColor: config.enableResize ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : 'transparent',
                    borderColor: useCerberusTheme ? '#404040' : '#e5e7eb',
                    color: config.enableResize ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#FFFFFF' : '#374151')
                  }}
                >
                  Redimensionar
                </Button>
                <Badge
                  variant={config.enableResize ? "default" : "secondary"}
                  className="w-full justify-center"
                  style={{
                    backgroundColor: config.enableResize ? (useCerberusTheme ? '#FDB813' : '#3b82f6') : (useCerberusTheme ? '#4A4A4A' : '#f3f4f6'),
                    color: config.enableResize ? (useCerberusTheme ? '#1A1A1A' : '#ffffff') : (useCerberusTheme ? '#B0B0B0' : '#6b7280')
                  }}
                >
                  {config.enableResize ? "Activado" : "Desactivado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del estado actual */}
        <Card style={{ backgroundColor: useCerberusTheme ? '#2D2D2D' : '#ffffff', borderColor: useCerberusTheme ? '#404040' : '#e5e7eb' }}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: useCerberusTheme ? '#FDB813' : '#3b82f6' }}>{events.length}</div>
                <div className="text-sm" style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>Eventos totales</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: useCerberusTheme ? '#FDB813' : '#10b981' }}>{currentView.toUpperCase()}</div>
                <div className="text-sm" style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>Vista actual</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: useCerberusTheme ? '#FDB813' : '#8b5cf6' }}>
                  {currentDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-sm" style={{ color: useCerberusTheme ? '#B0B0B0' : '#6b7280' }}>Fecha actual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendario principal */}
        <Card className="h-[700px]" style={{ backgroundColor: useCerberusTheme ? '#2D2D2D' : '#ffffff', borderColor: useCerberusTheme ? '#404040' : '#e5e7eb' }}>
          <CardContent className="p-0 h-full">
            <Calendar
              events={events}
              config={{
                ...config,
                theme: currentTheme
              }}
              currentDate={currentDate}
              view={currentView}
              // onEventClick={handleEventClick}
              onEventCreate={handleEventCreate}

            // onEventUpdate={handleEventUpdate}
            // onEventDelete={handleEventDelete}
            // onDateChange={setCurrentDate}
            // onViewChange={setCurrentView}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
