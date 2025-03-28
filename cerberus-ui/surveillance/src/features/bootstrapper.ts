import { Container } from "inversify";
import { useOperation } from "./operation";
import { useRound } from "./round";
import { useRun } from "./run";
import { useOperators } from "./operators";

export const bootstrapSurveillance = (container: Container) => {
    console.log("Surveillance bootstrapped");
    return useOperation(container)
        .then(container => useRound(container))
        .then(container => useRun(container))
        .then(container => useOperators(container));
}