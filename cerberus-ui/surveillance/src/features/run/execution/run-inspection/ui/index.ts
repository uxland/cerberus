import {OperationRunQuestionAnswer} from "../../domain/model.ts";
import {OptionsQuestionInput} from "./options-question-input.tsx";
import {TextQuestionInput} from "./text-question-input.tsx";
import {IntegerQuestionInput} from "./integer-question-input..tsx";
import {FloatQuestionInput} from "./float-question-input.tsx";
import {ComponentType} from 'react';
const factories = {
    Options: OptionsQuestionInput,
    Text: TextQuestionInput,
    Float: FloatQuestionInput,
    Integer: IntegerQuestionInput,
};

export const getQuestionInput: (question: OperationRunQuestionAnswer) => ComponentType = question => {
    return factories[question.question.__type]
}
