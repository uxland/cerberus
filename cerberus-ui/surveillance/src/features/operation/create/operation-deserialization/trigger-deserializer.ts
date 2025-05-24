import {Trigger} from "../domain";
import {specDeserializer} from "./spec-deserializer.ts";

const deserializeTrigger: (trigger: Trigger) => Trigger = (trigger) => {
    return {
        ...trigger,
        condition: specDeserializer(<any>trigger.condition)
    }
};

export {
    deserializeTrigger
}