export enum RunStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Released = 'Released',
    Dismissed = 'Dismissed',
}

export interface ScheduledRunSummary {
    id: string;
    roundId: string;
    description: string;
    plannedAt: Date;
    status: RunStatus;
    startedAt?: Date;
    startedBy?: Date | null;
    endedAt?: Date;
    endedBy?: Date | null;
}

export interface SchedulerEvent {
    event_id: string;
    title: string,
    start: Date,
    end: Date,
    color: string,
    editable: boolean,
    deletable: boolean,
    sx: {
        boxShadow: string,
        '&:hover': {
            backgroundColor: string,
            boxShadow: string,
        }
    }
    run: ScheduledRunSummary
}

const toEvent = (run: ScheduledRunSummary): SchedulerEvent => {
    const plannedAt = new Date(run.plannedAt);
    const end = new Date(run.plannedAt)
    end.setMinutes(end.getMinutes() + 60)
    return {
        event_id: run.id,
        title: run.description,
        start: plannedAt,
        end: end,
        color: run.status === RunStatus.Pending ? "#96f300" : "#ed4204",
        editable: false,
        deletable: false,
        sx: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            '&:hover': {
                backgroundColor: "#2a2a2a",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            }
        },
        run
    }
}

export const toEvents = (runs: ScheduledRunSummary[]): SchedulerEvent[] => (runs || []).map(toEvent);

const endedStatus = [RunStatus.Released, RunStatus.Cancelled, RunStatus.Dismissed];

export const isInCourse = (run: ScheduledRunSummary): boolean => {
    return !endedStatus.includes(run.status);
}
