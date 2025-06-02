import { CalendarEvent } from '@/types/calendar';

export interface EventLayout {
  event: CalendarEvent;
  left: number;
  width: number;
  zIndex: number;
}

export function calculateEventLayout(events: CalendarEvent[], totalWidth: number = 98): EventLayout[] {
  if (events.length === 0) return [];

  // Ordenar eventos por hora de inicio, luego por duración (más largos primero)
  const sortedEvents = [...events].sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;
    // Si empiezan a la misma hora, los más largos van primero
    return (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime());
  });

  // Encontrar grupos de eventos superpuestos
  const groups = findOverlapGroups(sortedEvents);
  
  const layouts: EventLayout[] = [];

  // Procesar cada grupo independientemente
  groups.forEach(group => {
    const groupLayouts = layoutEventGroup(group, totalWidth);
    layouts.push(...groupLayouts);
  });

  return layouts;
}

function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  const start1 = new Date(event1.start).getTime();
  const end1 = new Date(event1.end).getTime();
  const start2 = new Date(event2.start).getTime();
  const end2 = new Date(event2.end).getTime();

  // Considerar que los eventos se superponen si comparten al menos un minuto
  return start1 < end2 && start2 < end1;
}

function findOverlapGroups(events: CalendarEvent[]): CalendarEvent[][] {
  const groups: CalendarEvent[][] = [];
  const processed = new Set<string>();

  events.forEach(event => {
    if (processed.has(event.id)) return;

    // Crear un nuevo grupo con este evento
    const group = [event];
    processed.add(event.id);

    // Buscar todos los eventos que se superponen con cualquier evento del grupo
    let foundNew = true;
    while (foundNew) {
      foundNew = false;
      
      events.forEach(otherEvent => {
        if (processed.has(otherEvent.id)) return;

        // Verificar si este evento se superpone con alguno del grupo
        const overlapsWithGroup = group.some(groupEvent => eventsOverlap(groupEvent, otherEvent));
        
        if (overlapsWithGroup) {
          group.push(otherEvent);
          processed.add(otherEvent.id);
          foundNew = true;
        }
      });
    }

    groups.push(group);
  });

  return groups;
}

function layoutEventGroup(events: CalendarEvent[], totalWidth: number): EventLayout[] {
  if (events.length === 0) return [];
  
  // Usar un algoritmo más simple y robusto
  const layouts: EventLayout[] = [];
  
  // Ordenar eventos por hora de inicio, luego por duración (más largos primero)
  const sortedEvents = [...events].sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;
    return (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime());
  });
  
  // Mantener un mapa de columnas con los eventos asignados
  const columns: CalendarEvent[][] = [];
  const eventToColumn = new Map<string, number>();
  
  // Asignar cada evento a la primera columna disponible
  sortedEvents.forEach(event => {
    let placed = false;
    
    // Buscar una columna existente donde quepa
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      
      // Verificar si el evento puede ir en esta columna
      const canPlaceInColumn = !column.some(colEvent => eventsOverlap(event, colEvent));
      
      if (canPlaceInColumn) {
        column.push(event);
        eventToColumn.set(event.id, i);
        placed = true;
        break;
      }
    }
    
    // Si no se pudo colocar en ninguna columna, crear una nueva
    if (!placed) {
      columns.push([event]);
      eventToColumn.set(event.id, columns.length - 1);
    }
  });
  
  // Calcular el número máximo de eventos simultáneos
  const maxSimultaneous = getMaxSimultaneousEvents(events);
  const numColumns = Math.max(columns.length, maxSimultaneous);
  
  // Generar layouts para cada evento
  events.forEach(event => {
    const columnIndex = eventToColumn.get(event.id) || 0;
    
    // Calcular cuántas columnas puede ocupar este evento
    const availableColumns = calculateExpandableColumns(event, events, columnIndex, numColumns);
    
    // Calcular dimensiones
    const margin = 1;
    const columnWidth = numColumns === 1 ? totalWidth : (totalWidth - (margin * (numColumns - 1))) / numColumns;
    const eventWidth = columnWidth * availableColumns + (margin * Math.max(0, availableColumns - 1));
    const left = columnIndex * (columnWidth + margin);
    
    layouts.push({
      event,
      left,
      width: eventWidth,
      zIndex: columnIndex + 1
    });
  });

  return layouts;
}

function calculateExpandableColumns(targetEvent: CalendarEvent, allEvents: CalendarEvent[], startColumn: number, totalColumns: number): number {
  let expandableColumns = 1;
  
  // Verificar cuántas columnas consecutivas hacia la derecha puede ocupar
  for (let col = startColumn + 1; col < totalColumns; col++) {
    // Verificar si hay algún evento que se superpone con el targetEvent y está en esta columna
    const hasConflict = allEvents.some(event => {
      if (event.id === targetEvent.id) return false;
      
      // Solo verificar eventos que se superponen temporalmente
      if (!eventsOverlap(targetEvent, event)) return false;
      
      // Verificar si este evento está en la columna que estamos chequeando
      const eventColumn = getEventColumn(event, allEvents);
      return eventColumn === col;
    });
    
    if (hasConflict) break;
    expandableColumns++;
  }
  
  return expandableColumns;
}

function getEventColumn(targetEvent: CalendarEvent, allEvents: CalendarEvent[]): number {
  // Recrear el mismo algoritmo de asignación para obtener la columna correcta
  const sortedEvents = [...allEvents].sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;
    return (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime());
  });
  
  const columns: CalendarEvent[][] = [];
  
  for (const event of sortedEvents) {
    let placed = false;
    
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const canPlaceInColumn = !column.some(colEvent => eventsOverlap(event, colEvent));
      
      if (canPlaceInColumn) {
        column.push(event);
        placed = true;
        
        if (event.id === targetEvent.id) {
          return i;
        }
        break;
      }
    }
    
    if (!placed) {
      columns.push([event]);
      if (event.id === targetEvent.id) {
        return columns.length - 1;
      }
    }
  }
  
  return 0;
}

function getMaxSimultaneousEvents(events: CalendarEvent[]): number {
  if (events.length === 0) return 0;
  
  // Crear array de puntos de tiempo (inicio y fin de eventos)
  const timePoints: { time: number; type: 'start' | 'end'; eventId: string }[] = [];
  
  events.forEach(event => {
    timePoints.push({
      time: event.start.getTime(),
      type: 'start',
      eventId: event.id
    });
    timePoints.push({
      time: event.end.getTime(),
      type: 'end',
      eventId: event.id
    });
  });
  
  // Ordenar por tiempo, con los finales antes que los inicios en el mismo momento
  timePoints.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.type === 'end' ? -1 : 1;
  });
  
  let currentCount = 0;
  let maxCount = 0;
  
  timePoints.forEach(point => {
    if (point.type === 'start') {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount--;
    }
  });
  
  return maxCount;
}
