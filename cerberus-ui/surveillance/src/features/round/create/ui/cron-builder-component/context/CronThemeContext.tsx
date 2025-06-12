import React, { createContext, useContext } from 'react';
import { CronTheme } from '../types/cronTheme';
import { defaultTheme } from '../themes/cronThemes';

interface CronThemeContextType {
    theme: CronTheme;
    applyTheme: (element: HTMLElement) => void;
}

const CronThemeContext = createContext<CronThemeContextType>({
    theme: defaultTheme,
    applyTheme: () => { },
});

export const useCronTheme = () => {
    const context = useContext(CronThemeContext);
    if (!context) {
        throw new Error('useCronTheme must be used within a CronThemeProvider');
    }
    return context;
};

interface CronThemeProviderProps {
    theme: CronTheme;
    children: React.ReactNode;
}

export const CronThemeProvider: React.FC<CronThemeProviderProps> = ({
    theme,
    children,
}) => {
    const applyTheme = (element: HTMLElement) => {
        // Aplicar variables CSS al elemento
        Object.entries(theme.cssVariables).forEach(([key, value]) => {
            element.style.setProperty(key, value);
        });

        // Aplicar data attributes para styling
        element.setAttribute('data-cron-theme', 'custom');
    };

    return (
        <CronThemeContext.Provider value={{ theme, applyTheme }}>
            {children}
        </CronThemeContext.Provider>
    );
};
