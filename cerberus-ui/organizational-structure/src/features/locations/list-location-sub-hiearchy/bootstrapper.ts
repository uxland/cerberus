import {Container} from "inversify";
import {registerCommandHandler} from "@cerberus/core";
import {ListLocationSubHierarchy} from "./query.ts";
import {Handler} from "./handler.ts";

export const bootstrapListLocationSubHierarchy = (container: Container) => {
    registerCommandHandler(ListLocationSubHierarchy, Handler)
}