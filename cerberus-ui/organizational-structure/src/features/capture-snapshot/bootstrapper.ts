import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {CaptureSnapshots, Handler} from "./command.ts";

export const bootstrapCaptureSnapshot = (container: Container) => {
    requestHandler(CaptureSnapshots)(Handler);
    return Promise.resolve(container);
}