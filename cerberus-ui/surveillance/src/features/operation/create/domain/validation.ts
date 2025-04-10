import { z } from "zod";

export type OperationForm = z.infer<typeof SurveillanceOperationFormModelSchema>;
const OperationQuestionTypeSchema = z.enum(["Options", "Text", "Integer", "Float"]);

const BaseOperationQuestionSchema = z.object({
    __type: OperationQuestionTypeSchema,
    id: z.string().nonempty("Question id is required"),
    text: z.string().nonempty("Question text is required"),
    isMandatory: z.boolean(),
});

const TextQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Text"),
    minLength: z.number().optional(),
});

const IntegerQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Integer"),
    min: z.number().optional(),
    max: z.number().optional(),
    normalityRange: z.object({
        lowerBound: z.coerce.number().optional(),
        upperBound: z.coerce.number().optional(),
    }).optional(),
});

const FloatQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Float"),
    min: z.number().optional(),
    max: z.number().optional(),
    normalityRange: z.object({
        lowerBound: z.coerce.number().optional(),
        upperBound: z.coerce.number().optional(),
    }).optional(),
});

const OptionsQuestionSchema = BaseOperationQuestionSchema.extend({
    __type: z.literal("Options"),
    options: z.array(z.object({
        code: z.string().nonempty("Option code is required"),
        text: z.string().nonempty("Option text is required"),
        isAnomalous: z.boolean(),
    })).min(2, "At least two options are required"),
    type: z.enum(["Single", "Multiple"]),
});

const QuestionSchema = z.discriminatedUnion("__type", [
    TextQuestionSchema,
    IntegerQuestionSchema,
    FloatQuestionSchema,
    OptionsQuestionSchema
]);

export const SurveillanceOperationFormModelSchema = z.object({
    id: z.string().optional(),
    description: z.string().nonempty("Operation name is required"),
    questions: z.array(QuestionSchema).nonempty("At least one question is required"),
});