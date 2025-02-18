import {OperationQuestion, OperationQuestionType, OptionsQuestion} from "../domain";
import {OptionsQuestionInput} from "./options-question-input";
import {GenericQuestionInput} from "./generic-question-input.tsx";
export interface OperationQuestionActions{
    setQuestion(question: OperationQuestion): void;
    changeQuestionType(question: OperationQuestion, type: OperationQuestionType): void;
}

export const createOptionsEditor = (question: OperationQuestion, actions: OperationQuestionActions) => {
    return question.__type === "Options" ?  OptionsQuestionInput({question, actions}) : GenericQuestionInput({question, actions});
}