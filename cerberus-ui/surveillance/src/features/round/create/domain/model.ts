import { OperationSummary } from "../../../operation/list-operations/model.ts";
import { v4 as uuidv4 } from 'uuid';
import {
    LocationHierarchicalItem
} from "@cerberus/organizational-structure";
import { Camera } from "@mui/icons-material";

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

interface CameraAssignments {
    [cameraId: string]: {
        operationId: string;
        operationDescription: string;
        cameraId: string;
        cameraDescription: string;
        streamingUrl?: string;
    };
}

export const produceInspections = (assignments: CameraAssignments): Inspection[] => {
    const inspections: Inspection[] = Object.entries(assignments).map(
        ([cameraId, assignment], index) => {
            const inspection: Inspection = {
                id: uuidv4().toString(),
                cameraId: assignment.cameraId,
                cameraDescription: assignment.cameraDescription,
                streamingUrl: assignment.streamingUrl || undefined,
                operationId: assignment.operationId,
                operationDescription: assignment.operationDescription,
                order: index + 1,
            };
            return inspection;
        }
    );

    return inspections;
};
const getCamerasFromHierarchy = (locations: LocationHierarchicalItem[]): LocationHierarchicalItem[] => {
    const cameras: LocationHierarchicalItem[] = [];

    const traverse = (items: LocationHierarchicalItem[]) => {
        for (const item of items) {
            if (item.type === "Camera") {
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
    const inspections = getCamerasFromHierarchy(locations).map((camera, index) => (<Inspection>{
        id: (index + 1).toString(),
        cameraId: camera.id,
        cameraDescription: camera.description,
        streamingUrl: camera.streamingUrl,
        operationId: defaultOperation?.id,
        operationDescription: defaultOperation?.description,
        order: index
    }));
    const round: Round = {
        id: uuidv4().toString(),
        rootLocationId: locationId,
        description: undefined,
        cronExpression: undefined,
        inspections
    }
    return {
        round,
        operations,
        locations
    }
}
