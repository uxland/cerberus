import {IRequest} from "mediatr-ts";
import {Capture} from "./model.ts";

export class ListCapturesByCameraId implements IRequest<Capture[]>{
    constructor(public cameraId: string) {}
}