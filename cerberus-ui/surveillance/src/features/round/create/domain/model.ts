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
    deferredExecution?: DeferredSettings;
    inspections: Inspection[];
}
export interface DeferredSettings {
    clipDurationInSeconds: number;
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
    groups: SurveillanceGroup[];
}

export interface SurveillanceGroup {
    id: string;
    description: string;
}

export interface RoundLocationHierarchicalItem extends LocationHierarchicalItem {
    inRound: boolean;
}

export const getCamerasFromHierarchy = (locations: LocationHierarchicalItem[]): LocationHierarchicalItem[] => {
    const cameras: LocationHierarchicalItem[] = [];

    const traverse = (items: LocationHierarchicalItem[]) => {
        for (const item of items) {
            if (item.type === "Camera" || (<any>item.type) === 1) {
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

export const produceRoundEditionData = (locationId: string, operations: OperationSummary[], locations: LocationHierarchicalItem[], groups: SurveillanceGroup[]): RoundEditionData => {
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
        locations: cameras,
        groups
    }
}



export const createOrUpdateInspection = (
    operation: OperationSummary | null,
    cameras: LocationHierarchicalItem[] | null,
    currentInspections: Inspection[]
): Inspection[] => {
    if (!operation || !cameras || cameras.length === 0) {
        return currentInspections;
    }

    let updated = [...currentInspections];

    cameras.map(camera => {
        const idx = updated.findIndex(i => i.cameraId === camera.id);
        const newInsp: Inspection = {
            id: idx >= 0 ? updated[idx].id : uuidv4(),
            cameraId: camera.id,
            cameraDescription: camera.description,
            streamingUrl: camera.streamingUrl,
            operationId: operation.id,
            operationDescription: operation.description,
            order: idx >= 0 ? updated[idx].order : updated.length + 1
        };

        if (idx >= 0) {
            updated[idx] = newInsp;
        } else {
            updated.push(newInsp);
        }
    });

    return updated.map((insp, i) => ({ ...insp, order: i + 1 }));
};

export const removeInspection = (
    cameraIds: string[],
    currentInspections: Inspection[]
): Inspection[] => {
    const filtered = currentInspections.filter(ins => !cameraIds.includes(ins.cameraId));
    return filtered.map((ins, i) => ({ ...ins, order: i + 1 }));
};