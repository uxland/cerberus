import { registerCommandHandler } from "@cerberus/core";
import { ListRounds } from "./query.ts";
import { ListRoundsHandler } from "./handler.ts";

export const useListRounds = (container) => {
    registerCommandHandler(ListRounds, ListRoundsHandler);
    return Promise.resolve(container);
}