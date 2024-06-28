
enum CaptureErrorType{
    AuthenticationError = 'AuthenticationError',
    ConnectionError = 'ConnectionError',
    CaptureError = 'CaptureError',
    UnknownError = 'UnknownError'
}

interface CaptureError{
    message: string;
    type: CaptureErrorType;
}
export interface Capture{
    at: Date;
    snapshotPath?: string | undefined;
    thumbnailPath?: string | undefined;
    cameraId: string;
    cameraPath: string;
    successful: boolean;
    error?: CaptureError | undefined;
}