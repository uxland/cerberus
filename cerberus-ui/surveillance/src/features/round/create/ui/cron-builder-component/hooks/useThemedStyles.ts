import { useMemo } from 'react';
import { CronTheme } from '../types/cronTheme';

export const useThemedStyles = (theme: CronTheme) => {
    return useMemo(() => {
        return {
            // Estilos para botones
            button: {
                backgroundColor: theme.button.background,
                borderColor: theme.button.border,
                color: theme.button.text,
                '--hover-bg': theme.button.hover,
            } as React.CSSProperties,

            // Estilos para popover
            popover: {
                backgroundColor: theme.popover.background,
                borderColor: theme.popover.border,
                boxShadow: theme.popover.shadow,
                color: theme.text.primary,
            } as React.CSSProperties,

            // Estilos para checkbox
            checkbox: {
                backgroundColor: theme.checkbox.background,
                borderColor: theme.checkbox.border,
                // Cuando está checked, aplicamos estos estilos
                '&[data-state="checked"]': {
                    backgroundColor: theme.checkbox.checked,
                    borderColor: theme.checkbox.checked,
                    color: theme.checkbox.checkmark,
                },
            } as React.CSSProperties,

            // Estilos para scroll area
            scrollArea: {
                '--scrollbar-track': theme.scroll.track,
                '--scrollbar-thumb': theme.scroll.thumb,
                '--scrollbar-thumb-hover': theme.scroll.thumbHover,
            } as React.CSSProperties,

            // Estilos para badge
            badge: {
                backgroundColor: theme.badge.background,
                borderColor: theme.badge.border,
                color: theme.badge.text,
            } as React.CSSProperties,

            // Estilos para input
            input: {
                backgroundColor: theme.input.background,
                borderColor: theme.input.border,
                color: theme.input.text,
                '--focus-color': theme.input.focus,
            } as React.CSSProperties,

            // Estilos para select
            select: {
                backgroundColor: theme.select.background,
                borderColor: theme.select.border,
                color: theme.select.text,
                '--hover-bg': theme.select.hover,
            } as React.CSSProperties,

            // Estilos para contenedor principal
            container: {
                backgroundColor: theme.background,
                color: theme.text.primary,
                ...theme.cssVariables,
            } as React.CSSProperties,

            // Estilos para superficie/cards
            surface: {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text.primary,
            } as React.CSSProperties,

            // Clases CSS personalizadas
            classes: {
                textPrimary: { color: theme.text.primary },
                textSecondary: { color: theme.text.secondary },
                textMuted: { color: theme.text.muted },
                primary: { color: theme.primary },
                border: { borderColor: theme.border },
            },
        };
    }, [theme]);
};
