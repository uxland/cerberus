export interface RunSummary {
    id: string;
    locationId: string;
    locationDescription: string;
    roundId: string;
    roundDescription: string;
    performer: string;
    startTime: string;
    endTime: string;
    plannedAt: string;
    totalAnomalies: number;
    inspectionWithAnomalies: number;
}