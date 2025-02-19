import { OperationQuestion, OperationQuestionType, OptionsQuestion } from "../domain";
import { OptionsQuestionInput } from "./options-question-input";
import { GenericQuestionInput } from "./generic-question-input.tsx";
export interface OperationQuestionActions {
    setQuestion(questionId: string, question: OperationQuestion): void;
    removeQuestion(questionId: string): void;
    changeQuestionType(questionId: string, type: OperationQuestionType): void;
    index: number;
    path: string;
}

export const createQuestionEditor = (question: OperationQuestion, actions: OperationQuestionActions) => {
    return (
        <div className="flex flex-col gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full" key={question.id}>
            {question.__type === "Options" ? OptionsQuestionInput({ question: question as OptionsQuestion, actions }) : GenericQuestionInput({ question, actions })}
        </div>
    );
}