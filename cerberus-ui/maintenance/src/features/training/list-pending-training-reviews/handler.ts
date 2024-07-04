import { inject, injectable } from "inversify";
import { IRequestHandler } from "mediatr-ts";
import { PendingTrainingReview } from "./model.ts";
import { ApiClient } from "@cerberus/shared/src";
import { ListPendingReviewsByLocation } from "./query.ts";

@injectable()
export class Handler
  implements IRequestHandler<ListPendingReviewsByLocation, PendingTrainingReview[]>
{
  constructor(@inject(ApiClient) private apiClient: ApiClient) {}
  async handle(query: ListPendingReviewsByLocation): Promise<PendingTrainingReview[]> {
    const item: { path: string } = await this.apiClient.get(`hierarchy-items/${query.id}`);
    return await this.apiClient.get<PendingTrainingReview[]>(
      `/locations/${item.path}/pending-reviews`,
    );
  }
}
