import {Entity} from "@cerberus/shared/src";
import {MaintenanceIssueStatus} from "../model.ts";

enum CaptureErrorType {
    AuthenticationError = "AuthenticationError",
    ConnectionError = "ConnectionError",
    UnknownError = "UnknownError",
    ConnectionTimeout = "ConnectionTimeout"
}
interface CaptureError {
    message: string;
    type: CaptureErrorType;
}

interface FilterResult{
    filterId: string;
    filterDescription: string;
    at: Date;
    result: boolean;
    errorMessage?: string;
}

export interface MaintenanceIssueDetail extends Entity {
    snapshotUrl: string;
    cameraId: string;
    cameraPath: string;
    cameraDescription: string;
    captureError: CaptureError;
    errors: FilterResult[];
    status: MaintenanceIssueStatus;
    resolutionComment?: string | undefined;
    startedAt?: Date | undefined;
    startedBy?: string | undefined;
    finishedAt?: Date | undefined;
    finishedBy?: string | undefined;
}