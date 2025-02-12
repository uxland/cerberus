import {Entity} from "@cerberus/shared/src";
import {HierarchyItemType} from "../../../state/hierarchy-item.ts";

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
    brandName?: string | undefined;
    modelName?: string | undefined;
    price?: number | undefined;
    manufactureYear?: number | undefined;
}

const isNotNullish = (value: string | undefined) => {
    return value !== undefined && value !== null && value !== ""
}

const isCameraLocationValid = (settings: LocationSettings | undefined) => {
    return isNotNullish(settings?.description) && isNotNullish( settings.adminSettings?.ipAddress)
}

const isLocationValid = (settings: LocationSettings | undefined) => {
    return isNotNullish(settings?.description)
}

const noValidation = (settings: LocationSettings | undefined) =>  false
const validators = {
    [HierarchyItemType.camera]: isCameraLocationValid,
    [HierarchyItemType.location]: isLocationValid
}



export const isValid =(itemType: HierarchyItemType, settings?: LocationSettings | undefined): boolean => {
    const  validator = validators[itemType] || noValidation;
    return validator(settings)
}