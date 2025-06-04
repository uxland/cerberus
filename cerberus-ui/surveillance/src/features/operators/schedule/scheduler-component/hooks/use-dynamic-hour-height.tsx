import { useEffect, useState, useRef } from 'react';

/**
 * Hook para calcular dinámicamente la altura de las horas basada en el espacio disponible
 * @param startHour - Hora de inicio
 * @param endHour - Hora de fin
 * @param baseHourHeight - Altura mínima de cada hora (por defecto)
 * @param containerRef - Referencia al contenedor del calendario
 * @returns La altura calculada para cada hora
 */
export const useDynamicHourHeight = (
  startHour: number,
  endHour: number,
  baseHourHeight: number = 60,
  containerRef: React.RefObject<HTMLElement>
) => {
  const [calculatedHeight, setCalculatedHeight] = useState(baseHourHeight);
  const [shouldFillContainer, setShouldFillContainer] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {    const calculateHeight = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerHeight = container.clientHeight;
      
      // Obtener la altura ocupada por otros elementos (header, all-day events, etc.)
      const headerElements = container.querySelectorAll('[data-calendar-header]');
      let usedHeight = 0;
      
      headerElements.forEach(element => {
        if (element instanceof HTMLElement && element !== container) {
          usedHeight += element.offsetHeight;
        }
      });// Calcular espacio disponible para las horas
      const availableHeight = containerHeight - usedHeight;
      const totalHours = endHour - startHour;
      const minimumContentHeight = totalHours * baseHourHeight;
      
      // Determinar si el contenido debe llenar el contenedor o usar su altura natural
      const shouldFill = availableHeight > minimumContentHeight;
      setShouldFillContainer(shouldFill);
      
      // Calcular altura dinámica
      const dynamicHeight = shouldFill 
        ? Math.floor(availableHeight / totalHours)
        : baseHourHeight;

      setCalculatedHeight(Math.max(baseHourHeight, dynamicHeight));
    };// Calcular altura inicial con un pequeño retraso para asegurar que el DOM esté listo
    const timer = setTimeout(calculateHeight, 10);    // Observar cambios de tamaño con un pequeño debounce
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Usar un pequeño debounce para evitar cálculos excesivos
        setTimeout(calculateHeight, 50);
      });
      
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Observar cambios de ventana
    const handleResize = () => calculateHeight();
    window.addEventListener('resize', handleResize);    return () => {
      clearTimeout(timer);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [startHour, endHour, baseHourHeight, containerRef]);

  return { hourHeight: calculatedHeight, shouldFillContainer };
};
