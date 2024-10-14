export interface CalibrationResult {
    success: boolean;
    originalImageUrl: string;
    calibratedBase64Image?: string | undefined;
    errorMessage?: string | undefined;
}

export interface CameraFilterDetail{
    filterDescription: string;
    cameraDescription: string;
    args: unknown
}