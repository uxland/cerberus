export interface CalibrationResult {
    success: boolean;
    originalImageUrl: string;
    calibratedBase64Image?: string | undefined;
    errorMessage?: string | undefined;
}