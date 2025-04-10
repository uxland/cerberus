import { OperationQuestion } from "./model.ts";

export interface Option {
    code: string;
    text: string;
    isAnomalous: boolean;
}

export type OptionsTypology = "Single" | "Multiple";

export interface OptionsQuestion extends OperationQuestion {
    __type: "Options";
    options: Option[];
    type: OptionsTypology;
}

const createOptionId = (question: OptionsQuestion): string => {
    const maxId = question.options
        .map(option => Number.parseInt(option.code, 10))
        .filter(code => !Number.isNaN(code))
        .reduce((max, code) => Math.max(max, code), 0);
    return (maxId + 1).toString();
};

export const appendOption = (question: OptionsQuestion, code: string | undefined) => {
    const option = <Option>{
        code: code || createOptionId(question),
        text: "",
        isAnomalous: false
    }
    return { ...question, options: [...question.options, option] };
}

export const setOptionText = (question: OptionsQuestion, optionCode: string, text: string): OptionsQuestion => {
    return { ...question, options: question.options.map(o => o.code === optionCode ? { ...o, text } : o) };
}

export const setOptionCode = (question: OptionsQuestion, optionCode: string, code: string): OptionsQuestion => {
    return { ...question, options: question.options.map(o => o.code === optionCode ? { ...o, code } : o) };
}

export const setTypology = (question: OptionsQuestion, type: OptionsTypology): OptionsQuestion => {
    return { ...question, type };
}

export const removeOption = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    return { ...question, options: question.options.filter(o => o.code !== optionCode) };
}