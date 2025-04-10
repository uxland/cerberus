import {Container} from "inversify";
import {SetRunInspection} from "./command.ts";
import {SetRunInspectionHandler} from "./handler.ts";
import {registerCommandHandler} from "@cerberus/core";

export const useRunInspection = (container: Container) => {
    registerCommandHandler(SetRunInspection, SetRunInspectionHandler);
    return Promise.resolve(container);
}