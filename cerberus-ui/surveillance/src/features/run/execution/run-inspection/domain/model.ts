
import { Run, InspectionRun } from "../../domain/model.ts";


interface OperationAnswer {
    questionId: string;
    answer: any;
}
export interface InspectionRunData {
    runId: string;
    inspectionId: string;
    additionalComments: string | undefined;
    answers: OperationAnswer[];
}

export const getCurrentInspection: (run: Run) => InspectionRun | undefined = (run) => run.inspectionRuns.find(ir => ir.inspectionId === run.currentInspectionRunId);