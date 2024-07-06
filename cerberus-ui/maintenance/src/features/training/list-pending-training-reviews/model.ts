import {Entity} from '@cerberus/shared/src';

export interface PendingTrainingReview extends Entity {
  cameraPath: string;
  description: string;
  createdAt: Date;
  thumbnailUrl?: string | undefined;
}

export const getPendingReviewUrl = (review: PendingTrainingReview) =>
  `/training-reviews/${review.id}`;
