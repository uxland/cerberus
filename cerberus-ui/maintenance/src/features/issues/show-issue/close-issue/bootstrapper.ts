import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {Command, Handler} from "./command.ts";

export const bootstrapCloseIssue = (container: Container) =>{
    requestHandler(Command)(Handler);
    return Promise.resolve(container);
}