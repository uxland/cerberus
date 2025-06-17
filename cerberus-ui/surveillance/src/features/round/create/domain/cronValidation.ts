import { z } from "zod";
import { validateCron } from "../ui/cron-builder-component/utils/cronUtils";

/**
 * Validador personalizado para expresiones CRON
 * @param locale - Locale para los mensajes de error ('es', 'en', 'ca')
 * @param allowDefault - Si permite la expresión por defecto '* * * * *'
 */
export const createCronValidator = (
    locale: 'es' | 'en' | 'ca' = 'es',
    allowDefault: boolean = false
) => {
    return z.string()
        .min(1, 'cron expression is required')
        .refine((value) => {
            // Si no se permite la expresión por defecto, validarla
            if (!allowDefault && value === '* * * * *') {
                return false;
            }

            // Validar el formato usando la función validateCron
            const validation = validateCron(value, locale);
            return validation.isValid;
        }, (value) => {
            // Proporcionar mensaje de error específico
            if (!allowDefault && value === '* * * * *') {
                return { message: 'cron expression is required' };
            }

            const validation = validateCron(value, locale);
            return {
                message: validation.error || 'Invalid cron expression format'
            };
        });
};

/**
 * Validador CRON por defecto en español que no permite '* * * * *'
 */
export const cronValidator = createCronValidator('es', false);

/**
 * Validador CRON que permite la expresión por defecto '* * * * *'
 */
export const cronValidatorWithDefault = createCronValidator('es', true);
