import {IRequest, IRequestHandler} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";
import {NavigationService} from "@cerberus/core";

export class Command implements IRequest<void>{
    constructor(public issueId: string,) {}
}
@injectable()
export class Handler implements IRequestHandler<Command, void>{
    constructor(
        @inject(ApiClient) private apiClient: ApiClient,
        @inject(NavigationService) private router: NavigationService
    ) {
    }
    handle(command: Command): Promise<void> {

        return this.apiClient.put(`/maintenance-issues/${command.issueId}/start`, {
            body: <any>{}
        }).then(() => this.router.navigateBack());
    }
}