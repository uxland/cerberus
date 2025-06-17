import { es } from './es';
import { en } from './en';
import { ca } from './ca';

export const locales = {
    es,
    en,
    ca,
} as const;

export type SupportedLocale = keyof typeof locales;

export function getLocale(locale: SupportedLocale) {
    return locales[locale] || locales.es;
}

export { es, en, ca };
export type { Locale } from './es';
