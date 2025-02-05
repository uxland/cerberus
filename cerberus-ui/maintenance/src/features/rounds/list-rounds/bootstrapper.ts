import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {ListRounds} from "./query.ts";
import {Handler} from "./handler.ts";

export const bootstrapListOpenIssues = (container: Container) => {
    requestHandler(ListRounds)(Handler);
    return Promise.resolve(container);
}