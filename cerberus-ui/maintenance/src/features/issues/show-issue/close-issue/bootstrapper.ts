import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {CloseIssue, Handler} from "./command.ts";

export const bootstrapCloseIssue = (container: Container) =>{
    requestHandler(CloseIssue)(Handler);
    return Promise.resolve(container);
}