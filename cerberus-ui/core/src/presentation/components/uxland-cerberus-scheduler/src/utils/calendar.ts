
import { CalendarEvent, TimeSlot } from '@/types/calendar';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isSameDay, isWithinInterval, addMinutes, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr, { locale: es });
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  return days;
};

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const firstWeekStart = startOfWeek(start, { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(end, { weekStartsOn: 1 });
  
  const days = [];
  let current = firstWeekStart;
  
  while (current <= lastWeekEnd) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const navigateDate = (date: Date, direction: 'prev' | 'next', view: 'day' | 'week' | 'month') => {
  switch (view) {
    case 'day':
      return direction === 'prev' ? subDays(date, 1) : addDays(date, 1);
    case 'week':
      return direction === 'prev' ? subWeeks(date, 1) : addWeeks(date, 1);
    case 'month':
      return direction === 'prev' ? subMonths(date, 1) : addMonths(date, 1);
    default:
      return date;
  }
};

export const getEventsForDate = (events: CalendarEvent[], date: Date) => {
  return events.filter(event => {
    if (event.allDay) {
      return isSameDay(event.start, date);
    }
    return isWithinInterval(date, { start: startOfDay(event.start), end: endOfDay(event.end) });
  });
};

export const getEventsForDateRange = (events: CalendarEvent[], start: Date, end: Date) => {
  return events.filter(event => {
    return isWithinInterval(event.start, { start, end }) || 
           isWithinInterval(event.end, { start, end }) ||
           (event.start <= start && event.end >= end);
  });
};

export const generateTimeSlots = (startHour: number = 0, endHour: number = 24, interval: number = 30) => {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push({
        hour,
        minute,
        date: new Date(0, 0, 0, hour, minute)
      });
    }
  }
  return slots;
};

export const getEventPosition = (event: CalendarEvent, startHour: number, hourHeight: number) => {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  
  const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
  const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
  const startHourMinutes = startHour * 60;
  
  const top = ((startMinutes - startHourMinutes) / 60) * hourHeight;
  const height = ((endMinutes - startMinutes) / 60) * hourHeight;
  
  return { top: Math.max(0, top), height: Math.max(30, height) };
};

export const snapToGrid = (date: Date, interval: number = 30) => {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / interval) * interval;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), snappedMinutes);
};

export const getDateFromPosition = (y: number, date: Date, startHour: number, hourHeight: number) => {
  const totalMinutes = (y / hourHeight) * 60 + startHour * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
};
