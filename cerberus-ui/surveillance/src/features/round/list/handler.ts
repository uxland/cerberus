import { IRequestHandler } from "mediatr-ts";
import { ListRounds } from "./query.ts";
import { RoundSummary } from "./model.ts";
import { ApiClient } from "@cerberus/shared/src";
import { inject, injectable } from "inversify";

@injectable()
export class ListRoundsHandler implements IRequestHandler<ListRounds, RoundSummary[]> {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    async handle(query: ListRounds): Promise<RoundSummary[]> {
        const item: { path: string } = await this.apiClient.get(`hierarchy-items/${query.id}`);
        return await this.apiClient.get<RoundSummary[]>(`/rounds/${item.path}/surveillance-rounds`);
    }
}