import {Container} from "inversify";
import {Handler} from "./handler.ts";
import {ListCapturesByCameraId} from "./query.ts";
import {requestHandler} from "mediatr-ts";

export const bootstrapListCameraCaptures = (container: Container) => {
    requestHandler(ListCapturesByCameraId)(Handler);
    return Promise.resolve(container);
}