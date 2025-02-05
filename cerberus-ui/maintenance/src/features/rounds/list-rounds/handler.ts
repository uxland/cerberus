import {IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {ListRounds} from "./query.ts";
import {RoundSummary} from "./model.ts";

@injectable()
export class Handler implements IRequestHandler<ListRounds, RoundSummary[]>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    async handle(query: ListRounds): Promise<RoundSummary[]> {
        const item: {path: string} = await this.apiClient.get(`hierarchy-items/${query.id}`);
        return await this.apiClient.get<RoundSummary[]>(`/locations/${item.path}/rounds`);
    }

}