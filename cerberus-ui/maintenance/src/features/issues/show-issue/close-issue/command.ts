import {IRequest, IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {NavigationService} from "@cerberus/core";

export class CloseIssue implements IRequest<void>{
    constructor(public issueId: string, public observations?: string | undefined) {}
}

@injectable()
export class Handler implements IRequestHandler<CloseIssue, void>{
    constructor(
        @inject(ApiClient) private apiClient: ApiClient,
        @inject(NavigationService) private router: NavigationService
    ){
    }
    handle(command: CloseIssue): Promise<void> {
        return  this.apiClient.put(`/maintenance-issues/${command.issueId}/end`, {
            body: <any>{comment: command.observations}
        }).then(() => this.router.navigateBack());
    }

}