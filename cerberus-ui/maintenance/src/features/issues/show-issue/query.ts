import {IRequest, IRequestHandler} from "mediatr-ts";
import {MaintenanceIssueDetail} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

export class Query implements IRequest<MaintenanceIssueDetail>{
    constructor(public id: string) {}
}

@injectable()
export class Handler implements IRequestHandler<Query, MaintenanceIssueDetail>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {

    }
    handle(query: Query): Promise<MaintenanceIssueDetail> {
        return this.apiClient.get<MaintenanceIssueDetail>(`/maintenance-issues/${query.id}`);
    }

}