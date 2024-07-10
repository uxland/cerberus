import {inject, injectable} from 'inversify';
import {INotification, INotificationHandler, Mediator} from 'mediatr-ts';
import {ListLocationHierarchy} from './query.ts';

export class OrganizationStructureChanged implements INotification {}

@injectable()
export class Handler
  implements INotificationHandler<OrganizationStructureChanged>
{
  constructor(@inject(Mediator) private mediator: Mediator) {}
  handle(_: OrganizationStructureChanged): Promise<void> {
    setTimeout(() => this.mediator.send(new ListLocationHierarchy()), 500);
    return Promise.resolve();
  }
}
