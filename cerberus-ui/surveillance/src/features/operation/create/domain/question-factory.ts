import {
    appendQuestion,
    OperationQuestion,
    OperationQuestionType, setQuestion,
    SurveillanceOperationFormModel
} from "./model.ts";


type questionFactory = (model: SurveillanceOperationFormModel) => OperationQuestion;


const createQuestionId = (model: SurveillanceOperationFormModel): string => {
    return (model.questions || []).length.toString() + 1;
}

const operationFactory = (type: OperationQuestionType) => (model: SurveillanceOperationFormModel): OperationQuestion => {
    return <OperationQuestion>{
        __type: type,
        id: createQuestionId(model),
        isMandatory: true
    }
}
const operationOptionsFactory = (model: SurveillanceOperationFormModel): OperationQuestion => {
    return <OperationQuestion>{
        ...operationFactory("Options")(model),
        options: [],
        typology: "Single"
    }
}
const factoryMap: Record<OperationQuestionType, questionFactory> = {
    'Options': operationOptionsFactory,
    'Text': operationFactory("Text"),
    "Integer": operationFactory("Integer"),
    "Float": operationFactory("Float")
}

export const produceQuestion = (type: OperationQuestionType | undefined, model: SurveillanceOperationFormModel): SurveillanceOperationFormModel => {
    const factory = factoryMap[type || "Options"];
    const operation = factory(model);
    return appendQuestion(model, operation);
}
export const convertQuestionToType = (model: SurveillanceOperationFormModel, questionId: string, targetType: OperationQuestionType): SurveillanceOperationFormModel => {
    const operation = { ...factoryMap[targetType](model), id: questionId };
    return setQuestion(model, questionId, operation);
}
