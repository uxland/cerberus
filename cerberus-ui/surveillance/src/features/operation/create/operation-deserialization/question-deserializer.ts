import {OperationQuestion} from "../domain";
import {deserializeTrigger} from "./trigger-deserializer.ts";

const deserializeQuestion: (question: OperationQuestion) => OperationQuestion = (question) => {
    return {
        ...question,
        triggers: question.triggers ? question.triggers.map(deserializeTrigger) : undefined,
    }
};
export {
    deserializeQuestion
}