import { HandlerBase } from "@cerberus/core";
import { Run } from "../execution/domain/model";
import { runsEndpointUrl } from "../constants";
import { injectable } from "inversify";
import { ListRuns } from "./query";

@injectable()
export class ListRunsHandler extends HandlerBase<Run[], ListRuns> {
    async handle(request: ListRuns): Promise<Run[]> {
        const url = `${runsEndpointUrl}?locationId=${request.locationId}&roundId=${request.roundId}`;
        return await this.apiClient.get<Run[]>(url);
    }
}