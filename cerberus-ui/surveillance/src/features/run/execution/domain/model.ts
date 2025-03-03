export interface Run {
    id: string;
    roundId: string;
    rootLocationId: string;
    assignedGroupId?: string;
    executorId?: string;
    startedAt?: string;
    endedAt?: string;
    status: RunStatus;
    inspectionRuns: InspectionRun[];
    currentInspectionRunId?: string;
}

export interface InspectionRun {
    id: string;
    inspectionId: string;
    cameraId: string;
    cameraStreamingUrl: string;
    cameraDescription: string;
    startedAt?: string;
    endedAt?: string;
    status: RunStatus;
    operationRun: OperationRun;
    executorId?: string;
}

export interface OperationRun {
    operationId: string;
    description: string;
    answers: OperationRunQuestionAnswer[];
    additionalComments?: string;
}

export interface OperationRunQuestionAnswer {
    question: IOperationQuestion;
    answer?: IOperationAnswer;
}

export interface IOperationQuestion {
    code: string;
    text: string;
    type: string;
}

export interface IOperationAnswer {
    isAnomalous: boolean;
}

export interface TextAnswer extends IOperationAnswer {
    value: string;
}

export interface IntegerAnswer extends IOperationAnswer {
    value: number;
    isAnomalous: boolean;
}

export interface FloatAnswer extends IOperationAnswer {
    value: number;
    isAnomalous: boolean;
}

export interface OptionAnswerItem {
    code: string;
    isAnomalous: boolean;
}

export interface OptionAnswer extends IOperationAnswer {
    values: OptionAnswerItem[];
    isAnomalous: boolean;
}

export enum RunStatus {
    Pending = "Pending",
    Running = "Running",
    Completed = "Completed",
    Failed = "Failed",
    Cancelled = "Cancelled"
}