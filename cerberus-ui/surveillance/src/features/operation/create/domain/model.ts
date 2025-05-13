import { OptionsTypology, OptionsQuestion } from "./options-question.ts";
import { InteractionServiceImpl } from "@cerberus/core/src/interaction-service/interaction-service-impl.tsx";
import { Container } from "inversify";
import { ConfirmationMessage } from "@cerberus/core/src/interaction-service/confirmation-message.tsx";

export type OperationQuestionType = "Options" | "Text" | "Integer" | "Float"

export const questionOptionValues: Array<{ value: OperationQuestionType, label: string }> = [
    { value: "Options", label: "Opciones" },
    { value: "Text", label: "Texto" },
    { value: "Integer", label: "Entero" },
    { value: "Float", label: "Decimal" }
]
export const isAnomalousValues: Array<{ value: boolean, label: string }> = [
    { value: true, label: "Sí" },
    { value: false, label: "No" }
]
export interface OperationAction {
    description: string;
    alternatives: Array<OperationAction> | undefined;
}

export interface AnomalousSettings<T extends number | string | boolean | undefined = undefined> {
    actions: OperationAction[];
    value?: T | undefined;
}

export interface OperationQuestion {
    __type: OperationQuestionType;
    id: string;
    text: string;
    isMandatory: boolean;
}

export interface NormalityRange<T extends string | number> {
    lowerBound?: AnomalousSettings<T> | undefined;
    upperBound?: AnomalousSettings<T> | undefined;
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

export interface TextQuestion extends OperationQuestion {
    __type: "Text";
    minLength: number | undefined;
}
export interface IntegerQuestion extends OperationQuestion {
    __type: "Integer";
    min: number | undefined;
    max: number | undefined;
    normalityRange?: NormalityRange<number>;
}

export interface FloatQuestion extends OperationQuestion {
    __type: "Float";
    min: number | undefined;
    max: number | undefined;
    normalityRange?: NormalityRange<number>;
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

export const appendAction = async (question: OperationQuestion): Promise<OperationQuestion> => {


};
export const removeAction = (question: OperationQuestion, instructionIndex: number): OperationQuestion => {
}

// if (question.__type === "Options") {
//     const optionQuestion = question as OptionsQuestion;

//     // const hasOptionInstructions = optionQuestion.options.some(opt => opt.anomalousSettings.actions && opt.anomalousSettings.actions.length > 0);

//     // if (hasOptionInstructions) {

//     //     const message = "Se eliminarán las intrucciones añadidas a las opciones. ¿Desea continuar?";
//     //     const localContainer = new Container();

//     //     localContainer.bind(ConfirmationMessage).toConstantValue(ConfirmationMessage);

//     //     const interactionService = new InteractionServiceImpl(localContainer);
//     //     const confirmationResult = await interactionService.confirmMessage(message);
//     //     console.log("Confirmation result:", confirmationResult);
//     //     if (!confirmationResult.confirmed) {
//     //         return question;
//     //     }
//     //     question.options.map(opt => {
//     //         opt.instructions = [];
//     //     }
//     //     );
//     // }

// }
// const action = <OperationAction>{
//     description: "",
// };
// return { ...question, anomalousSettings: [...(question.instructions || []), action] };