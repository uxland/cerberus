import {NavigationService} from '@cerberus/core';
import {ApiClient} from '@cerberus/shared/src';

import {inject, injectable} from 'inversify';
import {IRequest, IRequestHandler} from 'mediatr-ts';
import {TrainingReviewResult} from './model.ts';

export class FulfillTrainingReview implements IRequest<void> {
  constructor(
    public trainingReviewId: string,
    public reviews: TrainingReviewResult
  ) {}
}
@injectable()
export class CommandHandler
  implements IRequestHandler<FulfillTrainingReview, void>
{
  constructor(
    @inject(ApiClient) private apiClient: ApiClient,
    @inject(NavigationService) private router: NavigationService
  ) {}

  async handle(command: FulfillTrainingReview): Promise<void> {
    try {
      await this.apiClient.put(
        `/training-reviews/${command.trainingReviewId}`,
        {
          body: command.reviews as any,
        }
      );
      this.router.navigateBack();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
