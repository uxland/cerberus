import { OperationRunQuestionAnswer } from "../../domain/model.ts";
import { OptionsQuestionInput } from "./inputs/options-question-input.tsx";
import { TextQuestionInput } from "./inputs/text-question-input.tsx";
import { IntegerQuestionInput } from "./inputs/integer-question-input..tsx";
import { FloatQuestionInput } from "./inputs/float-question-input.tsx";
import { ComponentType } from 'react';
import { UseFormReturn } from "react-hook-form";

const factories = {
    Options: OptionsQuestionInput,
    Text: TextQuestionInput,
    Float: FloatQuestionInput,
    Integer: IntegerQuestionInput,
};

export const getQuestionInput: (question: OperationRunQuestionAnswer, formMethods: UseFormReturn<unknown>, index: number) => ComponentType = question => {
    return factories[question.question.__type]
}
