import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Hook personalizado para detectar si hay scrollbar visible y obtener su ancho
 * @param theme - El tema del calendario para usar la clase de scrollbar correcta
 * @returns Un objeto con hasScrollbar (boolean) y scrollbarWidth (number)
 */
export const useScrollbarDetection = (theme?: { primary?: string }) => {
    const [hasScrollbar, setHasScrollbar] = useState(false);
    const [scrollbarWidth, setScrollbarWidth] = useState(8);
    const containerRef = useRef<HTMLDivElement>(null);

    const getCalendarScrollbarWidth = useCallback(() => {
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
    }, [theme?.primary]);

    const checkScrollbar = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // Buscar el elemento que contiene la scrollbar vertical principal
        // Este es el contenedor con clase 'overflow-auto calendar-scrollbar'
        const scrollContainer = container.querySelector('.overflow-auto.calendar-scrollbar');
        if (scrollContainer) {
            const hasVerticalScrollbar = scrollContainer.scrollHeight > scrollContainer.clientHeight;
            setHasScrollbar(hasVerticalScrollbar);
        } else {
            // Fallback: verificar si cualquier elemento hijo tiene scrollbar
            const scrollElements = container.querySelectorAll('.calendar-scrollbar');
            let foundScrollbar = false;
            
            scrollElements.forEach(element => {
                if (element.scrollHeight > element.clientHeight) {
                    foundScrollbar = true;
                }
            });
            
            setHasScrollbar(foundScrollbar);
        }
    }, []);

    useEffect(() => {
        const width = getCalendarScrollbarWidth();
        setScrollbarWidth(width);

        // Verificar scrollbar inicialmente con un pequeño delay para asegurar que el DOM esté listo
        const initialCheck = () => {
            setTimeout(checkScrollbar, 100);
        };
        
        initialCheck();

        // Crear un observer para detectar cambios en el contenido
        const resizeObserver = new ResizeObserver(() => {
            // Usar un timeout para evitar llamadas excesivas
            setTimeout(checkScrollbar, 50);
        });

        // Crear un MutationObserver para detectar cambios en el DOM
        const mutationObserver = new MutationObserver(() => {
            setTimeout(checkScrollbar, 50);
        });

        // Observar el contenedor principal
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
            mutationObserver.observe(containerRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        // Actualizar cuando cambie el tamaño de la ventana
        const handleResize = () => {
            const width = getCalendarScrollbarWidth();
            setScrollbarWidth(width);
            setTimeout(checkScrollbar, 50);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [getCalendarScrollbarWidth, checkScrollbar]);

    return { hasScrollbar, scrollbarWidth, containerRef };
};
