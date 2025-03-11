import {StartRun} from "./command.ts";
import {StartRunHandler} from "./start-run-handler.ts";
import {registerCommandHandler} from "@cerberus/core";

export const useStartRun  = (container: Container) => {

    registerCommandHandler(StartRun, StartRunHandler);
    return Promise.resolve(container);
}