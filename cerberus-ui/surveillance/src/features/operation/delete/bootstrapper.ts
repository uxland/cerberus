import { DeleteOperationHandler } from "./handler";
import { DeleteOperation } from "./command";
import { registerCommandHandler } from "@cerberus/core";
import { Container } from "inversify";

export const useDeleteOperation = (container: Container) => {
    registerCommandHandler(DeleteOperation, DeleteOperationHandler);
    return Promise.resolve(container);
}