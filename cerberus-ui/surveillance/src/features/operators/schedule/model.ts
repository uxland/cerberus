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
    plannedAt: Date;
    status: RunStatus;
    startedAt?: Date;
    startedBy?: Date | null;
    endedAt?: Date;
    endedBy?: Date | null;
}

export interface SchedulerEvent{
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
    /*color: "#f38b00",
    editable: false,
    deletable: false,
    sx: {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        '&:hover': {
            backgroundColor: "#2a2a2a",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
        }
    }*/
}

const toEvent = (run: ScheduledRunSummary): SchedulerEvent => {
    const plannedAt = new Date(run.plannedAt);
    const end = new Date(run.plannedAt)
    end.setMinutes(end.getMinutes() + 20)
    return {
        event_id: run.id,
        title: run.description,
        start: plannedAt,
        end: end,
        color: "#f38b00",
        editable: false,
        deletable: false,
        sx: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            '&:hover': {
                backgroundColor: "#2a2a2a",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            }
        }
    }
}

export const toEvents = (runs: ScheduledRunSummary[]): SchedulerEvent[] =>  (runs || []).map(toEvent);
