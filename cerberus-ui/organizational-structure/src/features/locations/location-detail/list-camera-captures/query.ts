import {Capture} from "./model.ts";
import {RequestBase, SetState} from "@cerberus/core";

export class ListCapturesByCameraId extends RequestBase<Capture[]>{
    constructor(public cameraId: string, setState: SetState<Capture[]>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}