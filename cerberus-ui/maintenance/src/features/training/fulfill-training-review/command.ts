import {IRequest, IRequestHandler} from "mediatr-ts";
import {TrainingReviewResult} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {navigateBack} from "@cerberus/core";

export class FulfillTrainingReview implements IRequest<void>{
    constructor(public trainingReviewId: string, public reviews: TrainingReviewResult) {}
}
@injectable()
export class CommandHandler implements IRequestHandler<FulfillTrainingReview, void>{
    constructor(@inject(ApiClient) private apiClient: ApiClient){
    }
    handle(command: FulfillTrainingReview): Promise<void> {
        return this.apiClient.put(`/training-reviews/${command.trainingReviewId}/review`, {
            body: command.reviews as any
        }).then(navigateBack);
    }
}