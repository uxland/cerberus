import {MaintenanceMode} from "../../model.ts";
import {Entity} from "@cerberus/shared/src";

interface MaintenanceSettings {
    maintenanceMode: MaintenanceMode;
    analysisFiltersArgs: {[key: string]: unknown};
}
export interface CameraMaintenanceSettings extends Entity{
    settings: MaintenanceSettings;
}