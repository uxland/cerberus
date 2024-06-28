import {Entity} from "@cerberus/shared/src";

interface Credentials{
    username: string;
    password: string;
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