import {Container} from "inversify";
import {useOperation} from "./operation";

export const bootstrapSurveillance = (container: Container) => {
    console.log("Surveillance bootstrapped");
    return useOperation(container);
}