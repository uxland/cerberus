import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {ListPendingReviewsByLocation} from "./query.ts";
import {Handler} from "./handler.ts";

export const bootstrapListPendingTrainingReviews = (container: Container) => {
    requestHandler(ListPendingReviewsByLocation)(Handler)
    return Promise.resolve(container);
}