import {Entity} from "@cerberus/shared/src";

export interface Credentials{
    username: string | undefined;
    password: string | undefined;
}

interface AdminSettings{
    ipAddress?: string | undefined;
    captureRecurrencePattern: string;
    cameraCredentials: Credentials;
}

export interface LocationSettings extends Entity{
    path: string;
    parentId?: string | undefined;
    description: string;
    adminSettings?: AdminSettings | undefined;
}