import { registerCommandHandler } from "@cerberus/core";
import { Container } from "inversify";
import { CreateRun } from "./command";
import { CreateRunHandler } from "./handler";

export const useCreateRun = (container: Container) => {
    registerCommandHandler(CreateRun, CreateRunHandler);
    return Promise.resolve(container);
}