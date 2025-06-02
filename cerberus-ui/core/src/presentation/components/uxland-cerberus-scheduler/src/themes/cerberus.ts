import { CalendarTheme } from '@/types/calendar';

export const cerberusTheme: CalendarTheme = {
  primary: '#FDB813', // Amarillo/dorado principal
  secondary: '#4A4A4A', // Gris medio
  background: '#1A1A1A', // Negro/gris muy oscuro
  surface: '#2D2D2D', // Gris oscuro para superficies
  border: '#404040', // Gris para bordes
  text: {
    primary: '#FFFFFF', // Blanco para texto principal
    secondary: '#B0B0B0', // Gris claro para texto secundario
    muted: '#808080', // Gris medio para texto deshabilitado
  },
  event: {
    background: '#FDB813', // Amarillo/dorado para eventos
    border: '#E6A500', // Amarillo más oscuro para bordes
    text: '#1A1A1A', // Negro para contraste con amarillo
  },
  header: {
    background: '#2D2D2D', // Gris oscuro para header
    text: '#FFFFFF', // Blanco para texto del header
  },
  grid: {
    lines: '#3A3A3A', // Gris medio para líneas de la grilla
    hourLines: '#4A4A4A', // Gris un poco más claro para líneas de horas
  },
  selection: {
    background: '#FDB813', // Amarillo para selecciones
    border: '#E6A500', // Amarillo más oscuro para bordes de selección
  },
  cssVariables: {
    '--primary-color': '#FDB813',
    '--event-text-color': '#1A1A1A'
  }
};
