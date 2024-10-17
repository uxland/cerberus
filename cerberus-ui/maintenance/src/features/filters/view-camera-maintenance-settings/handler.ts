import {CameraMaintenanceSettings} from "./model.ts";
import GetCameraMaintenanceSettings from "./query.ts";
import {injectable} from "inversify";
import {HandlerBase} from "@cerberus/core";

@injectable()
export class GetCameraMaintenanceSettingsHandler extends HandlerBase<CameraMaintenanceSettings, GetCameraMaintenanceSettings>{
    async handle({cameraId, setState, setBusy, setError}: GetCameraMaintenanceSettings): Promise<CameraMaintenanceSettings> {
        try {
            setBusy(true);
            const settings = await this.fetchCameraMaintenanceSettings(cameraId);
            setState(settings);
            return settings;
        }
        catch (e) {
            setError(e);
        }
        finally {
            setBusy(false);
        }
    }

    private fetchCameraMaintenanceSettings(cameraId: string): Promise<CameraMaintenanceSettings> {
        return this.apiClient.get<CameraMaintenanceSettings>(
            `camera-maintenance-settings/${cameraId}`
        )
    }
}