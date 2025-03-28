import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../../constants";
import { injectable } from "inversify";
import { ListRunsByRound } from "./query";
import { RunSummary } from "../model";

@injectable()
export class ListRunsByRoundHandler extends HandlerBase<RunSummary[], ListRunsByRound> {
    async handle(request: ListRunsByRound): Promise<RunSummary[]> {
        const url = `${runsEndpointUrl}?roundId=${request.roundId}`;
        return await this.apiClient.get<RunSummary[]>(url);
    }
}
