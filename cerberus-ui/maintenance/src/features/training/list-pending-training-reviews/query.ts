import {IRequest} from "mediatr-ts";
import {PendingTrainingReview} from "./model.ts";

export class ListPendingReviewsByLocation implements IRequest<PendingTrainingReview[]>{
    constructor(public id: string) {  }
}
