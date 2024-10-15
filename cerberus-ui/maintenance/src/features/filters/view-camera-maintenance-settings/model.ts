import {MaintenanceMode} from "../../model.ts";
import {Entity} from "@cerberus/shared/src";

export interface MaintenanceSettings {
    maintenanceMode: MaintenanceMode;
    analysisFiltersArgs: {[key: string]: {description: string, args: unknown}};
}
export interface CameraMaintenanceSettings extends Entity{
    settings: MaintenanceSettings;
}