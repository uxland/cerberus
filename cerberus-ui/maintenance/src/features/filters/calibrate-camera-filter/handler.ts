import {HandlerBase} from "@cerberus/core";
import {CalibrationResult} from "./model.ts";
import {CalibrateCameraFilter, GetCameraFilterArgs, SetCameraFilterArgs} from "./command.ts";
import {Mediator} from "mediatr-ts";
import GetCameraMaintenanceSettings from "../view-camera-maintenance-settings/query.ts";
import {CameraMaintenanceSettings} from "../view-camera-maintenance-settings/model.ts";


export class GetCameraFilterArgsHandler extends HandlerBase<unknown, GetCameraFilterArgs>{

    async handle(request: GetCameraFilterArgs): Promise<unknown> {
        const settings = await new Mediator().send<CameraMaintenanceSettings>(new GetCameraMaintenanceSettings(
            request.cameraId,
            () => {},
            request.setError,
            request.setBusy
        ));
        if(settings){
            const ars = settings.settings.analysisFiltersArgs[request.filterId];
            if(ars)
                request.setState(ars);
            else
                request.setError(new Error("Filternot found"));
        }
    }

}

export class CalibrateCameraFilterHandler extends HandlerBase<CalibrationResult, CalibrateCameraFilter>{
    async handle(request: CalibrateCameraFilter): Promise<CalibrationResult> {
        try {
            request.setBusy(true);
            const result = await this.fetchCalibrationResult(request);
            await request.setState(result);
        }
        catch (e) {
            console.error(e);
            request.setError(e);
        }
        finally {
            request.setBusy(false);
        }
        return this.apiClient.put<CalibrationResult>(
            `filters/${request.filterId}:calibrate`,
            {
                body: <any>request
            }
        )
    }

    private fetchCalibrationResult(request: CalibrateCameraFilter): Promise<CalibrationResult> {
        return this.apiClient.put<CalibrationResult>(
            `filters/${request.filterId}:calibrate`,
            {
                body: <any>{cameraId: request.cameraId, filterId: request.filterId, args: request.args}
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
            `camera-maintenance-settings/${request.cameraId}:filter-args/${request.filterId}`,
            {
                body: <any>request.args
            }
        )
    }

}