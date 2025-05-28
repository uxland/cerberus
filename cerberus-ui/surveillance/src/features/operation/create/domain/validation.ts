import { z } from "zod";
import { FieldErrors } from "react-hook-form";

export type OperationForm = z.infer<typeof SurveillanceOperationFormModelSchema>;
const OperationQuestionTypeSchema = z.enum(["Options", "Text", "Integer", "Float"]);

const OperationActionSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        description: z.string().nonempty("La descripción de la acción es obligatoria"),
        alternatives: z.array(OperationActionSchema).optional(),
    })
);

const TriggerConditionSchema = z.object({
    __type: z.string(),
    value: z.any().refine(val => val != null && val !== '', {
        message: "La descripción de la acción es obligatoria"
    }),
});

const TriggerSchema = z.object({
    id: z.string().nonempty("El ID del trigger es obligatorio"),
    condition: TriggerConditionSchema,
    actions: z
        .array(OperationActionSchema)
        .optional(),
});

const BaseOperationQuestionSchema = z.object({
    __type: OperationQuestionTypeSchema,
    id: z.string().nonempty("El ID de la pregunta es obligatorio"),
    text: z.string().nonempty("El texto de la pregunta es obligatorio"),
    isMandatory: z.boolean(),
    triggers: z.array(TriggerSchema).optional(),
});

const TextQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Text"),
    // minLength: z.number().min(0, "La longitud mínima debe ser mayor o igual a 0").optional(),
});

const IntegerQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Integer"),
});

const FloatQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Float"),
});

const OptionsQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Options"),
    options: z.array(z.object({
        code: z.string().nonempty("El código de la opción es obligatorio"),
        text: z.string().nonempty("El texto de la opción es obligatorio"),
    }))
        .min(2, "Se requieren al menos dos opciones"),
    type: z.enum(["Single", "Multiple"], {
        errorMap: () => ({ message: "El tipo debe ser 'Single' o 'Multiple'" })
    }),
});

const QuestionSchema = z.discriminatedUnion("__type", [
    TextQuestionSchema,
    IntegerQuestionSchema,
    FloatQuestionSchema,
    OptionsQuestionSchema
], {
    errorMap: () => ({ message: "Tipo de pregunta no válido" })
});

export const SurveillanceOperationFormModelSchema = z.object({
    id: z.string().optional(),
    description: z.string().nonempty("El nombre de la operación es obligatorio"),
    questions: z.array(QuestionSchema).nonempty("Se requiere al menos una pregunta"),
});




// Error summary function for the operation form validation
export const getValidationErrorSummary = (errors: FieldErrors<OperationForm>): string[] => {
    const errorMessages: string[] = [];

    if (errors.description) {
        errorMessages.push(`Operación: ${errors.description.message}`);
    }

    if (errors.questions) {
        // Error para el array 'questions' en sí (ej. "Se requiere al menos una pregunta")
        if (typeof errors.questions.message === 'string') {
            errorMessages.push(`Preguntas: ${errors.questions.message}`);
        }

        // Errores para elementos individuales dentro del array 'questions'
        if (Array.isArray(errors.questions)) {
            errors.questions.forEach((questionError, index) => {
                if (questionError) {
                    const questionNumber = index + 1;
                    if (questionError.text && questionError.text.message) {
                        errorMessages.push(`Pregunta ${questionNumber} (Texto): ${questionError.text.message}`);
                    }

                    // Manejar errores de 'options'
                    if (questionError.options) {
                        // Error general del array de opciones (ej. minLength) - formato root
                        if (questionError.options.root && questionError.options.root.message) {
                            errorMessages.push(`Pregunta ${questionNumber} (Opciones): ${questionError.options.root.message}`);
                        }

                        // Error general del array de opciones (formato directo) - mantener por compatibilidad
                        if (typeof questionError.options === 'object' &&
                            !Array.isArray(questionError.options) &&
                            !questionError.options.root &&
                            'message' in questionError.options &&
                            questionError.options.message) {
                            errorMessages.push(`Pregunta ${questionNumber} (Opciones): ${questionError.options.message}`);
                        }

                        // Errores específicos dentro de cada opción
                        if (Array.isArray(questionError.options)) {
                            questionError.options.forEach((optionError: any, optionIndex: number) => {
                                if (optionError) {
                                    const optionNumber = optionIndex + 1;
                                    if (optionError.text && optionError.text.message) {
                                        errorMessages.push(`Pregunta ${questionNumber}, Opción ${optionNumber} (Texto): ${optionError.text.message}`);
                                    }
                                    if (optionError.code && optionError.code.message) {
                                        errorMessages.push(`Pregunta ${questionNumber}, Opción ${optionNumber} (Código): ${optionError.code.message}`);
                                    }
                                }
                            });
                        }
                    }

                    if (questionError.triggers && Array.isArray(questionError.triggers)) {
                        questionError.triggers.forEach((triggerError: any, triggerIndex: number) => {
                            if (triggerError) {
                                // Agregar validación para condition.value
                                if (triggerError.condition && triggerError.condition.value && triggerError.condition.value.message) {
                                    errorMessages.push(`Pregunta ${questionNumber}, Trigger ${triggerIndex + 1}: ${triggerError.condition.value.message}`);
                                }

                                if (triggerError.actions && Array.isArray(triggerError.actions)) {
                                    triggerError.actions.forEach((actionError: any, actionIndex: number) => {
                                        if (actionError && actionError.description && actionError.description.message) {
                                            errorMessages.push(`Pregunta ${questionNumber}, Trigger ${triggerIndex + 1}, Acción ${actionIndex + 1}: ${actionError.description.message}`);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    return errorMessages;
};