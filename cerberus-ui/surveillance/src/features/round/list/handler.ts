import { ListRounds } from "./query.ts";
import { RoundSummary } from "./model.ts";
import { injectable } from "inversify";
import { roundsEndpointUrl } from "../constants.ts";
import { HandlerBase } from "@cerberus/core";

@injectable()
export class ListRoundsHandler extends HandlerBase<RoundSummary[], ListRounds> {
    handle(query: ListRounds): Promise<RoundSummary[]> {
        return this.listRounds(query);
    }

    private async listRounds(query: ListRounds): Promise<RoundSummary[]> {
        return this.apiClient.get<RoundSummary[]>(`/${roundsEndpointUrl}?rootLocationId=${query.rootLocationId}`);
    }
}