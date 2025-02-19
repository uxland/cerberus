import {
    appendQuestion,
    OperationQuestion,
    OperationQuestionType, setQuestion,
    SurveillanceOperationFormModel
} from "./model.ts";


type questionFactory = (model: SurveillanceOperationFormModel) => OperationQuestion;


const createQuestionId = (model: SurveillanceOperationFormModel): string => {
    const id = (model.questions || []).length + 1
    return id.toString();
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

export const produceQuestion = (type: OperationQuestionType | undefined, model: SurveillanceOperationFormModel): OperationQuestion => {
    const factory = factoryMap[type || "Options"];
    return  factory(model);
}
export const convertQuestionToType = (model: SurveillanceOperationFormModel, questionId: string, targetType: OperationQuestionType): OperationQuestion => {
    return { ...factoryMap[targetType](model), id: questionId };
}
