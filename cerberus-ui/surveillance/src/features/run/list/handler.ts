import { HandlerBase } from "@cerberus/core";
import { Run } from "../execution/domain/model";
import { ListRuns } from "./query";
import { runsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class ListRunsHandler extends HandlerBase<Run[], ListRuns> {
    async handle(request: ListRuns): Promise<Run[]> {
        return await this.apiClient.get<Run[]>(runsEndpointUrl);
    }
}
