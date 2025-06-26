import { CameraMaintenanceSettings } from "./model.ts";
import { IRequest } from "mediatr-ts";



export default class GetCameraMaintenanceSettings implements IRequest<CameraMaintenanceSettings> {
    constructor(public cameraId: string) {
    }
}