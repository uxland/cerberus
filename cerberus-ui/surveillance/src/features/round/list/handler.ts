import { IRequestHandler } from "mediatr-ts";
import { ListRounds } from "./query.ts";
import { RoundSummary } from "./model.ts";
import { ApiClient } from "@cerberus/shared/src";
import { inject, injectable } from "inversify";
import {roundsEndpointUrl} from "../constants.ts";

@injectable()
export class ListRoundsHandler implements IRequestHandler<ListRounds, RoundSummary[]> {
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    async handle(query: ListRounds): Promise<RoundSummary[]> {

        return await this.apiClient.get<RoundSummary[]>(`/${roundsEndpointUrl}?rootLocationId=${query.rootLocationId}`);
    }
}