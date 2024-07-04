import {IRequest, IRequestHandler} from "mediatr-ts";
import {MaintenanceIssueDetail} from "./model.ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

export class GetIssueDetail implements IRequest<MaintenanceIssueDetail>{
    constructor(public id: string) {}
}

@injectable()
export class Handler implements IRequestHandler<GetIssueDetail, MaintenanceIssueDetail>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {

    }
    handle(query: GetIssueDetail): Promise<MaintenanceIssueDetail> {
        return this.apiClient.get<MaintenanceIssueDetail>(`/maintenance-issues/${query.id}`);
    }

}