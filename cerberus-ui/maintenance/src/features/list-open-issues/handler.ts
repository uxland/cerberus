import {IRequestHandler} from "mediatr-ts";
import {inject} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {ListOpenIssues} from "./query.ts";
import {MaintenanceIssue} from "./model.ts";

export class Handler implements IRequestHandler<ListOpenIssues, MaintenanceIssue[]>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
    }
    handle(query: ListOpenIssues): Promise<MaintenanceIssue[]> {
        return this.apiClient.get<MaintenanceIssue[]>(`/maintenance/issues?path=${query.path}`);
    }

}