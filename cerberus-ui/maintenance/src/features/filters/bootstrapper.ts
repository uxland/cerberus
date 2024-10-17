import {Container} from "inversify";
import {bootstrapViewMaintenanceSettings} from "./view-camera-maintenance-settings/bootstrapper.ts";
import {bootstrapCalibrateCameraFilter} from "./calibrate-camera-filter/bootstrapper.ts";


export const bootstrapFilters = (container: Container) =>
    bootstrapViewMaintenanceSettings(container)
        .then(bootstrapCalibrateCameraFilter);