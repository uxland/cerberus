import {IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {ListOpenIssues} from "./query.ts";
import {MaintenanceIssueSummary} from "./model.ts";

@injectable()
export class Handler implements IRequestHandler<ListOpenIssues, MaintenanceIssueSummary[]>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    async handle(query: ListOpenIssues): Promise<MaintenanceIssueSummary[]> {
        const item: {path: string} = await this.apiClient.get(`hierarchy-items/${query.id}`);
        return await this.apiClient.get<MaintenanceIssueSummary[]>(`/locations/${item.path}/maintenance-issues`);
    }

}