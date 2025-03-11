import {OperationRunQuestionAnswer} from "../../domain/model.ts";
import {OptionsQuestionInput} from "./options-question-input.tsx";
import {TextQuestionInput} from "./text-question-input.tsx";
import {IntegerQuestionInput} from "./integer-question-input..tsx";
import {FloatQuestionInput} from "./float-question-input.tsx";

const factories = {
    Options: OptionsQuestionInput,
    Text: TextQuestionInput,
    Float: FloatQuestionInput,
    Integer: IntegerQuestionInput,
};

export const getQuestionInput: (question: OperationRunQuestionAnswer) => React.Component = question => {
    return factories[question.question.__type]
}
