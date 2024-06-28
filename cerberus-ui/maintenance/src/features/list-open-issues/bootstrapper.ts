import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {ListOpenIssues} from "./query.ts";
import {Handler} from "./handler.ts";

export const bootstrapListOpenIssues = (container: Container) => {
    requestHandler(ListOpenIssues)(Handler);
    return Promise.resolve(container);
}