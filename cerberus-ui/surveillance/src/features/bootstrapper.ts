import {Container} from "inversify";

export const bootstrapSurveillance = (container: Container) => {
    console.log("Surveillance bootstrapped");
    return container;
}