import { Container } from "inversify";
import { useOperation } from "./operation";
import { useRound } from "./round";
import { useRun } from "./run";

export const bootstrapSurveillance = (container: Container) => {
    console.log("Surveillance bootstrapped");
    return useOperation(container)
        .then(container => useRound(container))
        .then(container => useRun(container));
}