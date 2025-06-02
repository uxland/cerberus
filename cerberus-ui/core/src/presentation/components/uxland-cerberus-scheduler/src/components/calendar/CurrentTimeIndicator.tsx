import React from 'react';
import { CalendarTheme } from '@/types/calendar';
import { getCurrentTimePosition } from '@/hooks/use-current-time';

interface CurrentTimeIndicatorProps {
    currentTime: Date;
    startHour: number;
    hourHeight: number;
    theme?: CalendarTheme;
    showTimeLabel?: boolean;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({
    currentTime,
    startHour,
    hourHeight,
    theme,
    showTimeLabel = true
}) => {
    const position = getCurrentTimePosition(currentTime, startHour, hourHeight);

    // Si la hora actual está fuera del rango visible, no mostrar el indicador
    if (position === null) {
        return null;
    }

    const currentTimeString = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const indicatorColor = theme?.primary || '#ef4444'; // Rojo por defecto

    return (
        <div
            className="absolute left-0 right-0 z-[30] hover:z-[40] pointer-events-auto opacity-50 hover:opacity-100 transition-all duration-200 group py-1  "
            style={{ top: `${position - 8}px` }}
        >
            {/* Línea principal del indicador */}
            <div
                className="h-0.5 w-full relative mt-2"
                style={{ backgroundColor: indicatorColor }}
            >
                {/* Círculo al inicio de la línea */}
                <div
                    className="absolute -left-1 -top-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: indicatorColor }}
                />

                {/* Etiqueta de tiempo (solo visible en hover) */}
                {showTimeLabel && (
                    <div
                        className="absolute -top-3 left-2 text-xs font-medium px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                            backgroundColor: indicatorColor,
                            color: theme?.event?.text || '#ffffff'
                        }}
                    >
                        {currentTimeString}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentTimeIndicator;
