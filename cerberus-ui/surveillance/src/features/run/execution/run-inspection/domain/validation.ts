import { z } from "zod";
import { OperationRunQuestionAnswer } from "../../domain/model";

// Define el modelo recursivo para acciones y alternativas
const actionSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        description: z.string(),
        executed: z.boolean(),
        comments: z.string().optional(),
        alternatives: z.array(actionSchema).nullable().optional()
    })
);

export const createExecutionFormSchema = (
    questions: OperationRunQuestionAnswer[]
) => {
    return z.object({
        runId: z.string().nonempty("Run id is required"),
        inspectionId: z.string().nonempty("Inspection id is required"),
        additionalComments: z.string().optional(),
        answers: z.array(
            z.object({
                questionId: z.string().nonempty("Question id is required"),
                answer: z.union([
                    z.string().nullable(),
                    z.array(z.string())
                ]).optional(),
                actions: z.array(actionSchema).optional()
            })
        ),
        startedAt: z.date(),
    }).superRefine((data, ctx) => {
        // Validación de campos obligatorios existente
        questions.forEach((question, index) => {
            if (question.question.isMandatory && !data.answers[index]?.answer) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Esta pregunta es obligatoria",
                    path: [`answers.${index}.answer`],
                });
            }
        });
    });
};

export type ExecutionForm = z.infer<ReturnType<typeof createExecutionFormSchema>>;