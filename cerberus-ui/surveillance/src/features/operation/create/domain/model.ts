
export type OperationQuestionType = "Options" | "Text" | "Integer" | "Float"

export const questionOptionValues: Array<{value: OperationQuestionType, label: string}> = [
    {value: "Options", label: "Opciones"},
    {value: "Text", label: "Texto"},
    {value: "Integer", label: "Entero"},
    {value: "Float", label: "Decimal"}
    ]

export interface OperationQuestion {
    __type: OperationQuestionType;
    id: string;
    text: string;
    isMandatory: boolean;
}

export interface SurveillanceOperationFormModel {
    name: string;
    questions: OperationQuestion[];
}


export interface Option {
    code: string;
    text: string;
}

export type OptionsTypology = "Single" | "Multiple";

export interface TextQuestion extends OperationQuestion {
    __type: "Text";
    minLength: number | undefined;
}
export interface IntegerQuestion extends OperationQuestion {
    __type: "Integer";
    min: number | undefined;
    max: number | undefined;
}

export interface FloatQuestion extends OperationQuestion {
    __type: "Float";
    min: number | undefined;
    max: number | undefined;
}

export const setOperationText = (model: SurveillanceOperationFormModel, text: string): SurveillanceOperationFormModel =>
    ({ ...model, name: text });

export const appendQuestion = (model: SurveillanceOperationFormModel, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: [...model.questions, question] });

export const setQuestion = (model: SurveillanceOperationFormModel, questionId: string, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.map(q => q.id === questionId ? question : q) });

export const setQuestionText = (question: OperationQuestion, text: string): OperationQuestion => ({ ...question, text });

export const setQuestionMandatory = (question: OperationQuestion, isMandatory: boolean): OperationQuestion => ({ ...question, isMandatory });

export const removeQuestion = (model: SurveillanceOperationFormModel, questionId: string): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.filter(q => q.id !== questionId) });
