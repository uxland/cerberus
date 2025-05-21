import { OperationQuestion, Trigger } from "./model.ts";
import {
    appendAction, existsTrigger,
    removeAction
} from "./trigger-actions.ts";
import { ValueEqualsSpec } from "./action-specs.ts";

export interface Option {
    code: string;
    text: string;
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
        text: ""
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


export const appendActionToOption = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    return appendAction(question, optionCode) as OptionsQuestion;
};

export const removeActionFromOption = (question: OptionsQuestion, optionCode: string, actionIndex: number): OptionsQuestion => {
    return removeAction(question, optionCode, [actionIndex]) as OptionsQuestion;
};

export const getTriggerIndex = (question: OptionsQuestion, optionCode: string) => {
    const triggerIndex = question.triggers.findIndex(t => t.id === optionCode);
    return triggerIndex;
}
export const enableOptionTrigger = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    if (existsTrigger(question, optionCode)) return question;
    const trigger = <Trigger<string>>{
        id: optionCode,
        condition: new ValueEqualsSpec<string>(optionCode),
        actions: []
    }
    return { ...question, triggers: [...question.triggers || [], trigger] };
}
export const disableOptionTrigger = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    const triggerIndex = getTriggerIndex(question, optionCode);
    if (triggerIndex === -1) return question;
    return {
        ...question,
        triggers: question.triggers.filter((_, idx) => idx !== triggerIndex)
    }
}

