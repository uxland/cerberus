import { ListRounds } from "./query.ts";
import { RoundSummary } from "./model.ts";
import { inject, injectable } from "inversify";
import { roundsEndpointUrl } from "../constants.ts";
import { HandlerBase } from "@cerberus/core";

@injectable()
export class ListRoundsHandler extends HandlerBase<RoundSummary[], ListRounds> {
    async handle(query: ListRounds): Promise<RoundSummary[]> {
        return this.handleRequest(query, () => this.apiClient.get<RoundSummary[]>(`/${roundsEndpointUrl}?rootLocationId=${query.rootLocationId}`));
    }
}