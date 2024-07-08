import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {StartIssue, Handler} from "./command.ts";

export const bootstrapStartIssue = (container: Container) =>{
    requestHandler(StartIssue)(Handler);
    return Promise.resolve(container);
}