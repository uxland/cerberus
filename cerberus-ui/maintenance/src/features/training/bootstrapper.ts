import {Container} from "inversify";
import {bootstrapListPendingTrainingReviews} from "./list-pending-training-reviews/bootstrapper.ts";
import {bootstrapFulfillTrainingReview} from "./fulfill-training-review/bootstrapper.ts";

export const bootstrapTraining = (container: Container) => {
    return bootstrapListPendingTrainingReviews(container)
        .then(bootstrapFulfillTrainingReview);
}