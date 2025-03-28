export enum RunStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export interface ScheduledRunSummary {
    id: string;
    roundId: string;
    description: string;
    plannedAt: string;
    status: RunStatus;
    startedAt?: string;
    startedBy?: string | null;
    endedAt?: string;
    endedBy?: string | null;
}

