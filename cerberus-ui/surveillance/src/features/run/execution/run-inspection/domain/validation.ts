import { z } from "zod";
import { OperationRunQuestionAnswer } from "../../domain/model";

export const createExecutionFormSchema = (
    questions: OperationRunQuestionAnswer[]
) => {
    return z
        .object({
            runId: z.string().nonempty("Run id is required"),
            inspectionId: z.string().nonempty("Inspection id is required"),
            additionalComments: z.string().optional(),
            answers: z.array(
                z.object({
                    questionId: z.string().nonempty("Question id is required"),
                    answer: z.string().nullable().optional(),
                })
            ),
            startedAt: z.date(),
        })
        .superRefine((data, ctx) => {
            data.answers.forEach((item, index) => {
                const questionData = questions.find(
                    (q) => q.question.id === item.questionId
                );
                if (
                    questionData?.question.isMandatory &&
                    (!item.answer || item.answer.trim() === "")
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["answers", index, "answer"],
                        message: "Answer required.",
                    });
                }
            });
        });
};

export type ExecutionForm = z.infer<ReturnType<typeof createExecutionFormSchema>>;

