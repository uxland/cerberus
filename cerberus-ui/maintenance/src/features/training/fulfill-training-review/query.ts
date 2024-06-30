import {IRequest, IRequestHandler} from "mediatr-ts";
import {TrainingReview} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

export class Query implements IRequest<TrainingReview>{
    constructor(public trainingReviewId: string) {}
}

@injectable()
export class QueryHandler implements IRequestHandler<Query, TrainingReview>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    handle(request: Query): Promise<TrainingReview> {
        return this.apiClient.get(`/training-reviews/${request.trainingReviewId}`);
    }
}