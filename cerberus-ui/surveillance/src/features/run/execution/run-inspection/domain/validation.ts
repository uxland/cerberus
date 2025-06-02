import { z } from "zod";
import { OperationRunQuestionAnswer } from "../../domain/model";

const actionSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        description: z.string(),
        executed: z.boolean().optional(),
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
                if (
                    action.executed === false &&
                    action.alternatives &&
                    action.alternatives.length > 0
                ) {
                    const lastIndex = action.alternatives.length - 1;
                    const last = action.alternatives[lastIndex];
                    if (
                        last.alternatives &&
                        last.alternatives.length > 0 &&
                        last.executed !== true
                    ) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message:
                                "Debe completar la última alternativa si la acción principal no se ejecutó",
                            path: [...path, i, "alternatives", lastIndex, "executed"].map(String),
                        });
                    }
                }
                if (action.alternatives) {
                    validateActions(action.alternatives, [...path, i, "alternatives"]);
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