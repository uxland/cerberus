import { StartRun } from "./command.ts";
import { StartRunHandler } from "./start-run-handler.ts";
import { registerCommandHandler } from "@cerberus/core";
import { Container } from "inversify";

export const useStartRun = (container: Container) => {

    registerCommandHandler(StartRun, StartRunHandler);
    return Promise.resolve(container);
}