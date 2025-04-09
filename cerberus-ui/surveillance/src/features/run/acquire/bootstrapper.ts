import { registerCommandHandler } from "@cerberus/core";
import { Container } from "inversify";
import { AcquireRun } from "./command";
import { AcquireRunHandler } from "./handler";

export const useAcquireRun = (container: Container) => {
    registerCommandHandler(AcquireRun, AcquireRunHandler);
    return Promise.resolve(container);
}