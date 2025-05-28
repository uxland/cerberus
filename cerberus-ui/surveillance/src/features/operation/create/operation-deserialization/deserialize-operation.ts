import {SurveillanceOperationFormModel} from "../domain";
import {deserializeQuestion} from "./question-deserializer.ts";

const deserializeOperation: (operation: SurveillanceOperationFormModel) => SurveillanceOperationFormModel = (operation) => {
    return {
        ...operation,
        questions: operation.questions.map(deserializeQuestion)
    };
};
export {
    deserializeOperation
}