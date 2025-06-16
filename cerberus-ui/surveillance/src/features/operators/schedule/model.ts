export enum RunStatus {
    Pending = 'Pending',
    // InProgress = 'InProgress',
    Running = 'Running',
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

    let color;
    switch (run.status) {
        case RunStatus.Pending:
            color = "#FFC107";
            break;
        case RunStatus.Running:
            color = "#FF9800";
            break;
        case RunStatus.Released || RunStatus.Completed:
            color = "#66BB6A";
            break;
        default:
            color = "#ed4204";
    }


    return {
        event_id: run.id,
        title: run.description,
        start: plannedAt,
        end: end,
        color: color,
        editable: false,
        deletable: false,
        sx: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            '&:hover': {
                backgroundColor: color === "#FFC107" ? "#ffd54f" :
                    color === "#FF9800" ? "#ffb74d" :
                        color === "#66BB6A" ? "#81c784" : "#ef5350",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            }
        },
        run,
    }
}

export const toEvents = (runs: ScheduledRunSummary[]): SchedulerEvent[] => (runs || []).map(toEvent);

const endedStatus = [RunStatus.Released, RunStatus.Cancelled, RunStatus.Dismissed];

export const isInCourse = (run: ScheduledRunSummary): boolean => {
    return !endedStatus.includes(run.status);
}
