import {Entity} from "@cerberus/shared/src";
import {MaintenanceIssueStatus} from "../model.ts";


export interface MaintenanceIssueSummary extends Entity{
    path: string;
    cameraId: string;
    description: string;
    summary: string;
    createdAt: Date;
    startedAt: Date;
    status: MaintenanceIssueStatus;
}

export const getIssueUrl = (issue: MaintenanceIssueSummary) => `/maintenance/issues/${issue.id}`;