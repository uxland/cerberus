import { OperationSummary } from "../../../operation/list/model.ts";
import { v4 as uuidv4 } from 'uuid';
import {
    LocationHierarchicalItem
} from "@cerberus/organizational-structure";

export interface Round {
    id: string;
    rootLocationId: string;
    description: string;
    cronExpression: string;
    estimatedDuration?: number;
    assignedTo?: string;
    inspections: Inspection[];
}

export interface Inspection {
    id: string;
    cameraId: string;
    cameraDescription: string;
    streamingUrl?: string;
    operationId: string;
    operationDescription: string;
    order: number;
}

export interface RoundEditionData {
    round: Round;
    operations: OperationSummary[];
    locations: LocationHierarchicalItem[];
}

export interface RoundLocationHierarchicalItem extends LocationHierarchicalItem {
    inRound: boolean;
}

export const getCamerasFromHierarchy = (locations: LocationHierarchicalItem[]): LocationHierarchicalItem[] => {
    const cameras: LocationHierarchicalItem[] = [];

    const traverse = (items: LocationHierarchicalItem[]) => {
        for (const item of items) {
            if (item.type === "Camera" || item.type === 1) {
                cameras.push(item);
            }
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        }
    };

    traverse(locations);
    return cameras;
};

export const produceRoundEditionData = (locationId: string, operations: OperationSummary[], locations: LocationHierarchicalItem[]): RoundEditionData => {
    const defaultOperation = operations[0];

    const cameras = getCamerasFromHierarchy(locations);

    const round: Round = {
        id: uuidv4().toString(),
        rootLocationId: locationId,
        description: undefined,
        cronExpression: undefined,
        inspections: []
    }

    return {
        round,
        operations,
        locations: cameras
    }
}



export const createOrUpdateInspection = (
    operation: OperationSummary | null,
    camera: LocationHierarchicalItem | null,
    currentInspections: Inspection[]
): Inspection[] => {
    if (!operation || !camera) {
        return currentInspections;
    }

    const existingIndex = currentInspections.findIndex(i => i.cameraId === camera.id);

    const newInspection: Inspection = {
        id: existingIndex >= 0 ? currentInspections[existingIndex].id : uuidv4(),
        cameraId: camera.id,
        cameraDescription: camera.description,
        streamingUrl: camera.streamingUrl,
        operationId: operation.id,
        operationDescription: operation.description,
        order: existingIndex >= 0 ? currentInspections[existingIndex].order : currentInspections.length + 1
    };

    if (existingIndex >= 0) {
        const newInspections = [...currentInspections];
        newInspections[existingIndex] = newInspection;
        return newInspections;
    } else {
        return [...currentInspections, newInspection];
    }
};


export const removeInspection = (
    cameraId: string,
    currentInspections: Inspection[]
): Inspection[] => {
    const filteredInspections = currentInspections.filter(inspection =>
        inspection.cameraId !== cameraId
    );

    return filteredInspections.map((inspection, index) => ({
        ...inspection,
        order: index + 1
    }));
};