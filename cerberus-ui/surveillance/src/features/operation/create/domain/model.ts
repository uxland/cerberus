import { OptionsQuestion, OptionsTypology } from "./options-question.ts";
import { ISpec } from "@cerberus/core/src/specs/spec.ts";
import { appendAction, removeAction } from "./trigger-actions.ts";

export type OperationQuestionType = "Options" | "Text" | "Integer" | "Float"

export const questionOptionValues: Array<{ value: OperationQuestionType, label: string }> = [
    { value: "Options", label: "Opciones" },
    { value: "Text", label: "Texto" },
    { value: "Integer", label: "Entero" },
    { value: "Float", label: "Decimal" }
]
export interface OperationAction {
    description: string;
    alternatives: Array<OperationAction> | undefined;
}

export interface Trigger<T extends number | string = undefined> {
    id: string;
    condition: ISpec<T>;
    actions: OperationAction[] | undefined;
}

export interface OperationQuestion<T extends number | string = undefined> {
    __type: OperationQuestionType;
    id: string;
    text: string;
    isMandatory: boolean;
    triggers: Trigger<T>[] | undefined
}


export interface SurveillanceOperationFormModel {
    description: string;
    questions: OperationQuestion[];
}

export const defaultOperationModel: SurveillanceOperationFormModel = {
    description: "",
    questions: []
}

export const optionTypologyValues: Array<{ value: OptionsTypology, label: string }> = [
    { value: "Single", label: "Única" },
    { value: "Multiple", label: "Múltiple" }
]

export const isMandatoryValues: Array<{ value: boolean, label: string }> = [
    { value: true, label: "Sí" },
    { value: false, label: "No" }
]

export interface TextQuestion extends OperationQuestion<string> {
    __type: "Text";
    minLength: number | undefined;
}
export interface IntegerQuestion extends OperationQuestion<number> {
    __type: "Integer";
}

export interface FloatQuestion extends OperationQuestion<number> {
    __type: "Float";
}

export const setOperationText = (model: SurveillanceOperationFormModel, text: string): SurveillanceOperationFormModel =>
    ({ ...model, description: text });

export const appendQuestion = (model: SurveillanceOperationFormModel, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: [...model.questions, question] });

export const setQuestion = (model: SurveillanceOperationFormModel, questionId: string, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.map(q => q.id === questionId ? question : q) });

export const setQuestionText = (question: OperationQuestion, text: string): OperationQuestion => ({ ...question, text });

export const setQuestionMandatory = (question: OperationQuestion, isMandatory: boolean): OperationQuestion => ({ ...question, isMandatory });

export const removeQuestion = (model: SurveillanceOperationFormModel, questionId: string): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.filter(q => q.id !== questionId) });
export const getQuestionById = (model: SurveillanceOperationFormModel, questionId: string): OperationQuestion | undefined =>
    model.questions.find(q => q.id === questionId);

export const createTriggerId = (question: OperationQuestion): string => {
    const maxId = question.triggers
        ?.map(trigger => {
            const id = Number.parseInt(trigger.id, 10);
            return Number.isNaN(id) ? 0 : id;
        })
        .reduce((max, id) => Math.max(max, id), 0) ?? 0;
    return (maxId + 1).toString();
};

export const appendTrigger = <T extends number | string = undefined>(
    question: OperationQuestion<T>,
    condition: ISpec<T>
): OperationQuestion<T> => {
    const trigger = <Trigger<T>>{
        id: createTriggerId(question),
        condition: condition,
        actions: undefined
    }
    return { ...question, triggers: [...(question.triggers || []), trigger] };
}

export const setTriggerValue = <T extends number | string>(
    question: OperationQuestion<T>,
    triggerId: string,
    newValue: T
): OperationQuestion<T> => ({
    ...question,
    triggers: question.triggers?.map(t =>
        t.id !== triggerId
            ? t
            : {
                ...t,
                condition: new (t.condition.constructor as { new(v: T): ISpec<T> })(newValue)
            }
    )
});

export const removeTrigger = (question: OperationQuestion, triggerId: string): OperationQuestion => {
    return { ...question, triggers: question.triggers?.filter(t => t.id !== triggerId) };
}
export const appendActionToQuestion = (question: OperationQuestion, triggerId: string): OperationQuestion => {
    return appendAction(question, triggerId) as OperationQuestion;
}
export const removeActionFromQuestion = (question: OperationQuestion, triggerId: string, actionIndex: number): OperationQuestion => {
    return removeAction(question, triggerId, [actionIndex]) as OperationQuestion;
}

export const appendAlternativeToAction = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number
): OptionsQuestion => {
    return appendAction(question, optionCode, [actionIndex]) as OptionsQuestion;
};

export const removeAlternativeFromAction = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    altIndex: number
): OptionsQuestion => {
    return removeAction(question, optionCode, [actionIndex, altIndex]) as OptionsQuestion;
};
export const appendNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    alternativePath: number[]
): OptionsQuestion => {
    return appendAction(question, optionCode, [actionIndex, ...alternativePath]) as OptionsQuestion;
};

/** 
 * Remove the alternative at the given nesting path 
 */
export const removeNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    alternativePath: number[]
): OptionsQuestion => {
    return removeAction(question, optionCode, [actionIndex, ...alternativePath]) as OptionsQuestion;
};

/** Recursively descend into `alternatives`, following `path`, and append `newAlt`. */
