import {NavigationService} from '@cerberus/core';
import {ApiClient} from '@cerberus/shared/src';
import {inject, injectable} from 'inversify';
import {IRequest, IRequestHandler} from 'mediatr-ts';

export class StartIssue implements IRequest<void> {
  constructor(public issueId: string) {}
}
@injectable()
export class Handler implements IRequestHandler<StartIssue, void> {
  constructor(
    @inject(ApiClient) private apiClient: ApiClient,
    @inject(NavigationService) private router: NavigationService
  ) {}
  handle(command: StartIssue): Promise<void> {
    return this.apiClient
      .put(`/maintenance-issues/${command.issueId}/start`, {
        body: <any>{},
      })
      .then(() => this.router.navigateBack());
  }
}
