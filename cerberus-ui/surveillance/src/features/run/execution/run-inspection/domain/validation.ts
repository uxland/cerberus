import { z } from "zod";
import { OperationRunQuestionAnswer } from "../../domain/model";

const actionSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        description: z.string(),
        executed: z.boolean().nullable().optional(),
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
        questions.forEach((question, index) => {
            if (question.question.isMandatory && !data.answers[index]?.answer) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Esta pregunta es obligatoria",
                    path: [`answers.${index}.answer`],
                });
            }
        });

        const validateActions = (actions: any[], path: Array<string | number>) => {
            actions.forEach((action, i) => {
                // Si la acción fue ejecutada exitosamente, no necesitamos validar sus alternativas
                if (action.executed === true) {
                    return; // Salir temprano, no hay necesidad de validar alternativas
                }

                // Solo validar alternativas si la acción principal no fue ejecutada (false o null/undefined)
                if (action.executed === false && action.alternatives && action.alternatives.length > 0) {
                    // Verificar si hay alguna alternativa ejecutada
                    const hasExecutedAlternative = action.alternatives.some((alt: any) =>
                        alt.executed === true
                    );

                    // Solo validar si no hay alternativas ejecutadas Y hay alternativas sin responder
                    if (!hasExecutedAlternative) {
                        const hasUnansweredAlternatives = action.alternatives.some((alt: any) =>
                            alt.executed === undefined || alt.executed === null
                        );

                        if (hasUnansweredAlternatives) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: "Debe indicar si las alternativas fueron ejecutadas o no",
                                path: [...path, i, "alternatives"].map(String),
                            });
                        }

                        // Solo validar alternativas recursivamente si no hay alternativas ejecutadas
                        validateActions(action.alternatives, [...path, i, "alternatives"]);
                    }
                }
            });
        };

        data.answers.forEach((answer, aIndex) => {
            if (answer.actions) {
                validateActions(answer.actions, ['answers', aIndex, 'actions']);
            }
        });
    });
};

export type ExecutionForm = z.infer<ReturnType<typeof createExecutionFormSchema>>;