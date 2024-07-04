import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {Command, CommandHandler} from "./command.ts";
import {GetPendingTrainingReview, QueryHandler} from "./getPendingTrainingReview.ts";
export const bootstrapFulfillTrainingReview = (container: Container) => {
    requestHandler(Command)(CommandHandler);
    requestHandler(GetPendingTrainingReview)(QueryHandler);
    return Promise.resolve(container);
}
