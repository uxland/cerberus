import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../../constants";
import { injectable } from "inversify";
import { ListRunsByLocation } from "./query";
import { RunSummary } from "../model";

@injectable()
export class ListRunsByLocationHandler extends HandlerBase<RunSummary[], ListRunsByLocation> {
    async handle(request: ListRunsByLocation): Promise<RunSummary[]> {
        const url = `${runsEndpointUrl}?locationId=${request.locationId}`;
        return await this.apiClient.get<RunSummary[]>(url);
    }
}