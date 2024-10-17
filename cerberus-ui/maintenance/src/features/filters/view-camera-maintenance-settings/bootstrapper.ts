import {Container} from "inversify";
import GetCameraMaintenanceSettings from "./query.ts";
import {registerCommandHandler} from "@cerberus/core";
import {GetCameraMaintenanceSettingsHandler} from "./handler.ts";

export const bootstrapViewMaintenanceSettings = (container: Container) => {
    registerCommandHandler(GetCameraMaintenanceSettings, GetCameraMaintenanceSettingsHandler)
    return Promise.resolve(container);
}