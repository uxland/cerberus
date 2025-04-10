import { DeleteRoundHandler } from "./handler";
import { DeleteRound } from "./command";
import { registerCommandHandler } from "@cerberus/core";
import { Container } from "inversify";

export const useDeleteRound = (container: Container) => {
    registerCommandHandler(DeleteRound, DeleteRoundHandler);
    return Promise.resolve(container);
}