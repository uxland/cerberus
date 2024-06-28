import {Container} from "inversify";
import {bootstrapListPendingTrainingReviews} from "./list-pending-training-reviews/bootstrapper.ts";

export const bootstrapTraining = (container: Container) => {
    return bootstrapListPendingTrainingReviews(container);
}