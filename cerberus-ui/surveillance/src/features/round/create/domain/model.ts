

export interface Camera {
    id: string;
    description: string;
    url: string;
    capturePattern: string;
    username?: string;
    password?: string;
    brand?: string;
    model?: string;
    price?: number;
    yearOfManufacture?: number;
}
export interface Operation {
    id: string;
    description: string;
    questions: [];
}

export interface SurveillanceRoundFormModel {
    description: string;
    cameras: Camera[];
    operation: Operation[];
}

export const defaultRoundModel: SurveillanceRoundFormModel = {
    description: "",
    cameras: [],
    operation: []
}

export const setRoundDescription = (model: SurveillanceRoundFormModel, description: string): SurveillanceRoundFormModel =>
    ({ ...model, description: description });


export const setCamera = (model: SurveillanceRoundFormModel, cameraId: string, camera: Camera): SurveillanceRoundFormModel =>
    ({ ...model, cameras: model.cameras.map(c => c.id === cameraId ? camera : c) });

export const removeCamera = (model: SurveillanceRoundFormModel, cameraId: string): SurveillanceRoundFormModel =>
    ({ ...model, cameras: model.cameras.filter(c => c.id !== cameraId) });

export const getCameraById = (model: SurveillanceRoundFormModel, cameraId: string): Camera | undefined =>
    model.cameras.find(c => c.id === cameraId);
