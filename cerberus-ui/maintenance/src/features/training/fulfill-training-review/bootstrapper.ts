import {addRoute, registerRouteComponent, store} from '@cerberus/core';
import {Container} from 'inversify';
import {requestHandler} from 'mediatr-ts';
import {CommandHandler, FulfillTrainingReview} from './command.ts';
import {FulfillTrainingReviewPage} from './component.tsx';
import {
  GetPendingTrainingReview,
  QueryHandler,
} from './get-pending-training-review.ts';

export const bootstrapFulfillTrainingReview = (container: Container) => {
  registerRouteComponent(
    FulfillTrainingReviewPage.name,
    FulfillTrainingReviewPage
  );
  store.dispatch(
    addRoute({
      path: 'training-reviews/:id',
      componentName: FulfillTrainingReviewPage.name,
      name: 'training',
    })
  );
  requestHandler(FulfillTrainingReview)(CommandHandler);
  requestHandler(GetPendingTrainingReview)(QueryHandler);
  return Promise.resolve(container);
};
