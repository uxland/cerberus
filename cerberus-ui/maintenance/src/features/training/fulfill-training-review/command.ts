import {IRequest, IRequestHandler} from "mediatr-ts";
import {FilterResultReview} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {navigateBack} from "@cerberus/core";

export class Command implements IRequest<void>{
    constructor(public trainingReviewId: string, public reviews: {[key: string]: FilterResultReview}) {}
}

@injectable()
export class CommandHandler implements IRequestHandler<Command, void>{
    constructor(@inject(ApiClient) private apiClient: ApiClient){
    }
    handle(command: Command): Promise<void> {
        return this.apiClient.put(`/training-reviews/${command.trainingReviewId}/review`, {
            body: command.reviews as any
        }).then(navigateBack);
    }
}