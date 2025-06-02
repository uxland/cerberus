
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CalendarEvent, CalendarTheme } from '@/types/calendar';
import { formatDate } from '@/utils/calendar';

interface EventModalProps {
  isOpen: boolean;
  event?: CalendarEvent | null;
  defaultStart?: Date;
  defaultEnd?: Date;
  defaultAllDay?: boolean;
  theme?: CalendarTheme;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  event,
  defaultStart,
  defaultEnd,
  defaultAllDay = false,
  theme,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    startTime: '',
    endTime: '',
    allDay: false,
    backgroundColor: theme?.event?.background || '#3b82f6',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start: formatDate(event.start, 'yyyy-MM-dd'),
        end: formatDate(event.end, 'yyyy-MM-dd'),
        startTime: event.allDay ? '' : formatDate(event.start, 'HH:mm'),
        endTime: event.allDay ? '' : formatDate(event.end, 'HH:mm'),
        allDay: event.allDay || false,
        backgroundColor: event.backgroundColor || theme?.event?.background || '#3b82f6',
      });
    } else if (defaultStart && defaultEnd) {
      setFormData({
        title: '',
        description: '',
        start: formatDate(defaultStart, 'yyyy-MM-dd'),
        end: formatDate(defaultEnd, 'yyyy-MM-dd'),
        startTime: defaultAllDay ? '' : formatDate(defaultStart, 'HH:mm'),
        endTime: defaultAllDay ? '' : formatDate(defaultEnd, 'HH:mm'),
        allDay: defaultAllDay,
        backgroundColor: theme?.event?.background || '#3b82f6',
      });
    }
  }, [event, defaultStart, defaultEnd, defaultAllDay, theme?.event?.background]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    let startDate: Date;
    let endDate: Date;

    if (formData.allDay) {
      startDate = new Date(formData.start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(formData.end);
      endDate.setHours(23, 59, 59, 999);
    } else {
      const [startHour, startMinute] = formData.startTime.split(':').map(Number);
      const [endHour, endMinute] = formData.endTime.split(':').map(Number);

      startDate = new Date(formData.start);
      startDate.setHours(startHour, startMinute, 0, 0);

      endDate = new Date(formData.end);
      endDate.setHours(endHour, endMinute, 0, 0);
    }

    const eventData: Partial<CalendarEvent> = {
      id: event?.id,
      title: formData.title,
      description: formData.description,
      start: startDate,
      end: endDate,
      allDay: formData.allDay,
      backgroundColor: formData.backgroundColor,
    };

    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const colorOptions = [
    { color: '#3b82f6', name: 'Azul' },
    { color: '#ef4444', name: 'Rojo' },
    { color: '#10b981', name: 'Verde' },
    { color: '#FDB813', name: 'Dorado' },
    { color: '#8b5cf6', name: 'Púrpura' },
    { color: '#f97316', name: 'Naranja' },
    { color: '#06b6d4', name: 'Cian' },
    { color: '#84cc16', name: 'Lima' },
    { color: '#ec4899', name: 'Rosa' },
    { color: '#6366f1', name: 'Índigo' },
    { color: '#14b8a6', name: 'Turquesa' },
    { color: '#f59e0b', name: 'Ámbar' },
    { color: '#8b5a2b', name: 'Marrón' },
    { color: '#6b7280', name: 'Gris' },
    { color: '#1f2937', name: 'Slate' },
    { color: '#991b1b', name: 'Rojo oscuro' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px] rounded-xl shadow-2xl"
        style={{
          backgroundColor: theme?.surface || '#ffffff',
          borderColor: theme?.border || '#e5e7eb',
          color: theme?.text?.primary || '#111827',
          border: `1px solid ${theme?.border || '#e5e7eb'}`
        }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle
            className="text-xl font-semibold"
            style={{ color: theme?.text?.primary || '#111827' }}
          >
            {event ? 'Editar evento' : 'Crear evento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium"
              style={{ color: theme?.text?.primary || '#111827' }}
            >
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título del evento"
              className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: theme?.background || '#ffffff',
                borderColor: theme?.border || '#e5e7eb',
                color: theme?.text?.primary || '#111827',
                boxShadow: 'none'
              }}
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium"
              style={{ color: theme?.text?.primary || '#111827' }}
            >
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del evento"
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50 resize-none"
              style={{
                backgroundColor: theme?.background || '#ffffff',
                borderColor: theme?.border || '#e5e7eb',
                color: theme?.text?.primary || '#111827',
                boxShadow: 'none'
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allDay"
              checked={formData.allDay}
              onCheckedChange={(checked) => setFormData({ ...formData, allDay: checked })}
            />
            <Label
              htmlFor="allDay"
              style={{ color: theme?.text?.primary || '#111827' }}
            >
              Todo el día
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="start"
                style={{ color: theme?.text?.primary || '#111827' }}
              >
                Fecha inicio
              </Label>
              <Input
                id="start"
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                style={{
                  backgroundColor: theme?.background || '#ffffff',
                  borderColor: theme?.border || '#e5e7eb',
                  color: theme?.text?.primary || '#111827',
                  boxShadow: 'none'
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="end"
                style={{ color: theme?.text?.primary || '#111827' }}
              >
                Fecha fin
              </Label>
              <Input
                id="end"
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                style={{
                  backgroundColor: theme?.background || '#ffffff',
                  borderColor: theme?.border || '#e5e7eb',
                  color: theme?.text?.primary || '#111827',
                  boxShadow: 'none'
                }}
              />
            </div>
          </div>

          {!formData.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="startTime"
                  style={{ color: theme?.text?.primary || '#111827' }}
                >
                  Hora inicio
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  style={{
                    backgroundColor: theme?.background || '#ffffff',
                    borderColor: theme?.border || '#e5e7eb',
                    color: theme?.text?.primary || '#111827',
                    boxShadow: 'none'
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="endTime"
                  style={{ color: theme?.text?.primary || '#111827' }}
                >
                  Hora fin
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  style={{
                    backgroundColor: theme?.background || '#ffffff',
                    borderColor: theme?.border || '#e5e7eb',
                    color: theme?.text?.primary || '#111827',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <Label style={{ color: theme?.text?.primary || '#111827' }}>
              Color del evento
            </Label>
            <div className="grid grid-cols-8 gap-2 mt-3">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.color}
                  type="button"
                  className="group relative w-10 h-10 rounded-lg border-2 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: colorOption.color,
                    borderColor: formData.backgroundColor === colorOption.color
                      ? theme?.primary || '#3b82f6'
                      : 'transparent',
                    boxShadow: formData.backgroundColor === colorOption.color
                      ? `0 0 0 2px ${theme?.primary || '#3b82f6'}40`
                      : undefined
                  }}
                  onClick={() => setFormData({ ...formData, backgroundColor: colorOption.color })}
                  title={colorOption.name}
                >
                  {formData.backgroundColor === colorOption.color && (
                    <div className="absolute inset-0 rounded-lg flex items-center justify-center">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{
                          backgroundColor: ['#FDB813', '#f59e0b', '#84cc16'].includes(colorOption.color) ? '#1A1A1A' : '#ffffff'
                        }}
                      ></div>
                    </div>
                  )}
                  {/* Tooltip hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                    {colorOption.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 border-t" style={{ borderColor: theme?.border || '#e5e7eb' }}>
          <div className="flex justify-between w-full">
            <div>
              {event && onDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="hover:bg-red-600 transition-colors duration-200"
                  style={{
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    color: '#ffffff'
                  }}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div className="space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="transition-all duration-200 hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: theme?.border || '#e5e7eb',
                  color: theme?.text?.primary || '#374151'
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme?.primary || '#3b82f6',
                  borderColor: theme?.primary || '#3b82f6',
                  color: theme?.primary === '#FDB813' ? '#1A1A1A' : '#ffffff'
                }}
              >
                {event ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
