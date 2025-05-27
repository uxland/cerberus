
import { Run, InspectionRun } from "../../domain/model.ts";
import {OperationAction, OperationQuestion} from "../../../../operation/create/domain";


export interface OperationAnswer {
    questionId: string | string[];
    answer: any;
    actions: Action[] | null;
}
export interface InspectionRunData {
    runId: string;
    inspectionId: string;
    additionalComments: string | undefined;
    answers: OperationAnswer[];
    startedAt: Date | undefined;
}

export interface Action {
    description: string;
    executed: boolean | null;
    comments: string;
    alternatives: Action[] | null;
}

export const getCurrentInspection: (run: Run) => InspectionRun | undefined = (run) => run.inspectionRuns.find(ir => ir.inspectionId === run.currentInspectionRunId);

export const getRequiredActions: (question: OperationQuestion, values: any[]) => OperationAction[] = (question, values) => {
    const triggers = question.triggers || [];
    const matched = triggers.find(trigger => {
        return values.some(v => trigger.condition.isSatisfiedBy(v))
    });
    if (!matched) return [];
    return matched.actions;
}