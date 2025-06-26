import { CameraMaintenanceSettings } from "./model.ts";
import GetCameraMaintenanceSettings from "./query.ts";
import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";

@injectable()
export class GetCameraMaintenanceSettingsHandler extends HandlerBase<CameraMaintenanceSettings, GetCameraMaintenanceSettings> {
    async handle(request: GetCameraMaintenanceSettings): Promise<CameraMaintenanceSettings> {
        const settings = await this.fetchCameraMaintenanceSettings(request.cameraId);
        return settings;
    }

    private fetchCameraMaintenanceSettings(cameraId: string): Promise<CameraMaintenanceSettings> {
        return this.apiClient.get<CameraMaintenanceSettings>(
            `camera-maintenance-settings/${cameraId}`
        )
    }
}