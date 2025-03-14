import { z } from "zod";

const AnswerSchema = z.object({
    questionId: z.string().nonempty("Question id is required"),
    answer: z.string().nonempty("Answer is required"),
});

export const createExecutionFormSchema = (expectedQuestions: number) => {
    return z
        .object({
            runId: z.string().nonempty("Run id is required"),
            inspectionId: z.string().nonempty("Inspection id is required"),
            additionalComments: z.string().optional(),
            answers: z.array(AnswerSchema),
        })
        .superRefine((data, ctx) => {
            if (data.answers.length < expectedQuestions) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["answers"],
                    message: `Se requieren ${expectedQuestions} respuestas`,
                });
            }
        });
};

export type ExecutionForm = z.infer<ReturnType<typeof createExecutionFormSchema>>;

