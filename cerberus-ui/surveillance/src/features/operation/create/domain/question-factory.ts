import {
    getQuestionById,
    OperationQuestion,
    OperationQuestionType,
    SurveillanceOperationFormModel
} from "./model.ts";


type questionFactory = (model: SurveillanceOperationFormModel) => OperationQuestion;


const createQuestionId = (model: SurveillanceOperationFormModel): string => {
    const maxId = (model.questions || [])
        .map(question => Number.parseInt(question.id, 10))
        .filter(id => !Number.isNaN(id))
        .reduce((max, id) => Math.max(max, id), 0);
    return (maxId + 1).toString();
};
const operationFactory = (type: OperationQuestionType) => (model: SurveillanceOperationFormModel): OperationQuestion => {
    return <OperationQuestion>{
        __type: type,
        id: createQuestionId(model),
        isMandatory: true,
    }
}
const operationOptionsFactory = (model: SurveillanceOperationFormModel): OperationQuestion => {
    return <OperationQuestion>{
        ...operationFactory("Options")(model),
        options: [
            {
                code: "0",
                text: "",
                anomalousSettings: undefined
            }
        ],
        type: "Single"
    }
}
const operationIntFloatFactory = (type: OperationQuestionType) => (model: SurveillanceOperationFormModel): OperationQuestion => {
    return <OperationQuestion>{
        ...operationFactory(type)(model),
        min: undefined,
        max: undefined,
        normalityRange: {
            lowerBound: undefined,
            upperBound: undefined
        }
    }
}
const factoryMap: Record<OperationQuestionType, questionFactory> = {
    'Options': operationOptionsFactory,
    'Text': operationFactory("Text"),
    "Integer": operationIntFloatFactory("Integer"),
    "Float": operationIntFloatFactory("Float")
}

export const produceQuestion = (type: OperationQuestionType | undefined, model: SurveillanceOperationFormModel): OperationQuestion => {
    const factory = factoryMap[type || "Options"];
    return factory(model);
}
export const convertQuestionToType = (model: SurveillanceOperationFormModel, questionId: string, targetType: OperationQuestionType): OperationQuestion => {
    const question = getQuestionById(model, questionId);
    return { ...factoryMap[targetType](model), id: questionId, text: question?.text, isMandatory: question?.isMandatory };
}
