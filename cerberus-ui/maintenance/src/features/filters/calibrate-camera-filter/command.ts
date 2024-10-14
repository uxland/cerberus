import {CalibrationResult, CameraFilterDetail} from "./model.ts";
import {RequestBase, SetState} from "@cerberus/core";


export class GetCameraFilterArgs extends RequestBase<CameraFilterDetail>{
   constructor(public cameraId: string, public filterId: string,
               setState: SetState<unknown>, setBusy: SetState<boolean>, setError: SetState<Error>,) {
       super(setState, setBusy, setError);
   }
}


export class CalibrateCameraFilter extends RequestBase<CalibrationResult[]> {
    constructor(public cameraId: string, public filterId: string, public args: unknown,
                setState: SetState<CalibrationResult>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}

export class SetCameraFilterArgs extends RequestBase<void>{
    constructor(public cameraId: string, public filterId: string, public args: unknown,
                setState: SetState<void>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}