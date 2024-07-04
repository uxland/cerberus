import {addRoute, registerRouteComponent, store} from '@cerberus/core';
import {Container} from 'inversify';
import {requestHandler} from 'mediatr-ts';
import {Command, CommandHandler} from './command.ts';
import {FulfillTrainingReviewPage} from './component.tsx';
import {
  GetPendingTrainingReview,
  QueryHandler,
} from './getPendingTrainingReview.ts';
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
  requestHandler(Command)(CommandHandler);
  requestHandler(GetPendingTrainingReview)(QueryHandler);
  return Promise.resolve(container);
};
