import {Entity} from '@cerberus/shared/src';

export interface PendingTrainingReview extends Entity {
  cameraPath: string;
  description: string;
  createdAt: Date;
}

export const getPendingReviewUrl = (review: PendingTrainingReview) =>
  `/training-reviews/${review.id}`;
