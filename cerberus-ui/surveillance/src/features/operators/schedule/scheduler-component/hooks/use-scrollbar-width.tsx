import { useEffect, useState } from 'react';

/**
 * Hook personalizado para obtener el ancho dinámico de la scrollbar del calendario
 * @param theme - El tema del calendario para usar la clase de scrollbar correcta
 * @returns El ancho de la scrollbar en píxeles
 */
export const useScrollbarWidth = (theme?: { primary?: string }) => {
    const [scrollbarWidth, setScrollbarWidth] = useState(8); // Valor por defecto de las scrollbars personalizadas

    useEffect(() => {
        const getCalendarScrollbarWidth = () => {
            // Crear un div temporal para medir el ancho real de la scrollbar
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll'; // Forzar scrollbar
            // @ts-expect-error - msOverflowStyle is for legacy IE/WinJS apps
            outer.style.msOverflowStyle = 'scrollbar';

            // Aplicar las clases de calendario según el tema
            const themeClass = theme?.primary === '#FDB813' ? 'theme-cerberus' : 'theme-default';
            outer.className = `calendar-scrollbar ${themeClass}`;

            document.body.appendChild(outer);

            const inner = document.createElement('div');
            outer.appendChild(inner);

            const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

            document.body.removeChild(outer);

            // Si no se detecta ancho de scrollbar, usar el valor por defecto de 8px
            // que corresponde a las scrollbars personalizadas
            return scrollbarWidth || 8;
        };

        const width = getCalendarScrollbarWidth();
        setScrollbarWidth(width);

        // Actualizar el ancho de la scrollbar cuando cambie el tamaño de la ventana
        const handleResize = () => {
            const width = getCalendarScrollbarWidth();
            setScrollbarWidth(width);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [theme?.primary]); // Agregar dependencia del tema

    return scrollbarWidth;
};
