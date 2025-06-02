// Estilos principales
import '../index.css'

// Componentes principales
export { default as Calendar } from '../components/calendar/Calendar'

// Componentes individuales (opcional para uso avanzado)
export { default as CalendarHeader } from '../components/calendar/CalendarHeader'
export { default as DayView } from '../components/calendar/DayView'
export { default as WeekView } from '../components/calendar/WeekView'
export { default as MonthView } from '../components/calendar/MonthView'
export { default as EventCard } from '../components/calendar/EventCard'
export { default as EventModal } from '../components/calendar/EventModal'
export { default as CurrentTimeIndicator } from '../components/calendar/CurrentTimeIndicator'

// Tipos
export type {
    CalendarEvent,
    CalendarView,
    CalendarConfig,
    CalendarTheme,
    CalendarProps,
    TimeSlot
} from '../types/calendar'

// Temas
export { cerberusTheme } from '../themes/cerberus'

// Utilidades
export * from '../utils/calendar'
export * from '../utils/eventOverlap'

// Hooks útiles
export { useCurrentTime } from '../hooks/use-current-time'
export { useScrollbarWidth } from '../hooks/use-scrollbar-width'

// Componentes UI básicos (opcional, si quieres incluirlos)
export { Button } from '../components/ui/button'
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
export { Badge } from '../components/ui/badge'
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
export { Input } from '../components/ui/input'
export { Label } from '../components/ui/label'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
export { Textarea } from '../components/ui/textarea'
