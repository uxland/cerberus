import { Container } from "inversify";
import { ListRunsByLocation } from "./query.ts";
import { ListRunsByLocationHandler } from "./handler.ts";
import { registerCommandHandler } from "@cerberus/core";


export const useListRunsByLocation = (container: Container) => {
    registerCommandHandler(ListRunsByLocation, ListRunsByLocationHandler);
    return Promise.resolve(container);
}