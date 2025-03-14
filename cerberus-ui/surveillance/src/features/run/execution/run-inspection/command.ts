import { IRequest } from "mediatr-ts";
import { Run, InspectionRunData } from '../domain/model.ts';

// interface OperationAnswer {
//     questionId: string;
//     answer: any;
// }
// interface InspectionRunData {
//     runId: string;
//     inspectionId: string;
//     additionalComments: string | undefined;
//     answers: OperationAnswer[];
// }

export class SetRunInspection implements IRequest<Run> {
    constructor(public data: InspectionRunData) {
    }
}