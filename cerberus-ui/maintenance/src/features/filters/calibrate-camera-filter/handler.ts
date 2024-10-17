import {HandlerBase} from "@cerberus/core";
import {CalibrationResult, CameraFilterDetail} from "./model.ts";
import {CalibrateCameraFilter, GetCameraFilterArgs, SetCameraFilterArgs} from "./command.ts";


export class GetCameraFilterArgsHandler extends HandlerBase<unknown, GetCameraFilterArgs>{

    async handle({cameraId, filterId, setBusy, setError, setState}: GetCameraFilterArgs): Promise<CameraFilterDetail> {
        try {
            setBusy(true);
            const settings = await this.apiClient.get<CameraFilterDetail>(`camera-maintenance-settings/${cameraId}/filters/${filterId}`);
            setState(settings);
            return settings;
        }
        catch (e) {
            console.error(e);
            setError(e);
        }
        finally {
            setBusy(false);
        }

    }

}

export class CalibrateCameraFilterHandler extends HandlerBase<CalibrationResult, CalibrateCameraFilter>{
    async handle(request: CalibrateCameraFilter): Promise<CalibrationResult> {
        request.setState([]);
        return super.handleRequest(request, this.fetchCalibrationResult.bind(this));
    }

    private fetchCalibrationResult(request: CalibrateCameraFilter): Promise<CalibrationResult> {
        return this.apiClient.put<CalibrationResult>(
            `filters/${request.filterId}:calibrate`,
            {
                body: <any>request
            }
        )
    }
}

export class SetCameraFilterArgsHandler extends HandlerBase<void, SetCameraFilterArgs>{
    async handle(request: SetCameraFilterArgs): Promise<void> {
        try {
         request.setBusy(true);
         await this.fetchSetCameraFilterArgs(request);
         this.navigationService.navigateBack();
        }
        catch (e) {
            console.error(e);
            request.setError(e);
        }
        finally {
            request.setBusy(false);
        }
    }

    private fetchSetCameraFilterArgs(request: SetCameraFilterArgs): Promise<void> {
        return this.apiClient.put<void>(
            `camera-maintenance-settings/${request.cameraId}/filters/${request.filterId}`,
            {
                body: <any>request.args
            }
        )
    }

}