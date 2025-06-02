import { useEffect, useState } from 'react';

/**
 * Hook personalizado para obtener la hora actual del sistema
 * Se actualiza cada minuto para mantener el indicador sincronizado
 * @returns La fecha/hora actual
 */
export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Actualizar inmediatamente
        setCurrentTime(new Date());

        // Configurar un intervalo para actualizar cada minuto
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60,000 ms = 1 minuto

        return () => {
            clearInterval(interval);
        };
    }, []);

    return currentTime;
};

/**
 * Función para calcular la posición del indicador de hora actual
 * @param currentTime - La hora actual
 * @param startHour - Hora de inicio del calendario (ej: 8)
 * @param hourHeight - Altura de cada hora en píxeles
 * @returns La posición top en píxeles, o null si está fuera del rango visible
 */
export const getCurrentTimePosition = (
    currentTime: Date,
    startHour: number,
    hourHeight: number
): number | null => {
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Convertir a minutos totales desde medianoche
    const totalMinutesFromMidnight = currentHours * 60 + currentMinutes;
    const startMinutes = startHour * 60;

    // Si la hora actual está antes del horario visible, retornar null
    if (totalMinutesFromMidnight < startMinutes) {
        return null;
    }

    // Calcular la posición relativa desde el inicio del horario visible
    const minutesFromStart = totalMinutesFromMidnight - startMinutes;
    const position = (minutesFromStart / 60) * hourHeight;

    return position;
};
