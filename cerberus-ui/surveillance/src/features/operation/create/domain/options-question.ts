import {OperationQuestion, Option, OptionsTypology} from "./model.ts";

export interface OptionsQuestion extends OperationQuestion {
    __type: "Options";
    options: Option[];
    typology: OptionsTypology;
}

const createOptionId = (question: OptionsQuestion): string =>{
    return (question.options || []).length.toString() + 1;
}

export const appendOption = (question: OptionsQuestion, code: string | undefined) =>{
    const option = <Option>{
        code: code || createOptionId(question),
        text: ""
    }
    return {...question, options: [...question.options, option]};
}

export const setOptionText = (question: OptionsQuestion, optionCode: string, text: string): OptionsQuestion => {
    return {...question, options: question.options.map(o => o.code === optionCode ? {...o, text} : o)};
}

export const setOptionCode = (question: OptionsQuestion, optionCode: string, code: string): OptionsQuestion => {
    return {...question, options: question.options.map(o => o.code === optionCode ? {...o, code} : o)};
}

export const setTypology = (question: OptionsQuestion, typology: OptionsTypology): OptionsQuestion => {
    return {...question, typology};
}
//ToDO: remove option