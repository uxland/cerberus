import {CameraMaintenanceSettings} from "./model.ts";

import {RequestBase, SetState} from "@cerberus/core";



export default class GetCameraMaintenanceSettings extends RequestBase<CameraMaintenanceSettings> {
    constructor(public cameraId: string,
                setState: SetState<CameraMaintenanceSettings>,
                setError: SetState<Error>,
                setBusy: SetState<boolean>
    ) {
        super(setState, setError, setBusy);
    }
}