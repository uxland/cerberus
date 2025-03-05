
import { OperationRunQuestionAnswer } from "../execution/domain/model";
import { IRequest } from 'mediatr-ts';

export class SetRunInspection implements IRequest<string> {
    constructor(public id: string | undefined, public inspectionId: string, public answers: OperationRunQuestionAnswer[]) { }
}



