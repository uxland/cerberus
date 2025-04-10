import { OperationQuestion } from "../../../operation/create/domain";

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
    question: OperationQuestion;
    answer?: IOperationAnswer;
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
    Dismissed = "Dismissed",
    Released = "Released"
}

export const getCurrentInspectionRun = (run: Run): InspectionRun | undefined => {
    return run.inspectionRuns.find(ir => ir.inspectionId === run.currentInspectionRunId);
}

export const setInspectionResponse = (inspectionRun: InspectionRun, question: OperationQuestion, answer: IOperationAnswer): InspectionRun => {
    const answers = inspectionRun.operationRun.answers.map(a => {
        if (a.question.id === question.id) {
            return {
                question,
                answer
            }
        }
        return a;
    });

    return {
        ...inspectionRun,
        operationRun: {
            ...inspectionRun.operationRun,
            answers
        }
    }
}


