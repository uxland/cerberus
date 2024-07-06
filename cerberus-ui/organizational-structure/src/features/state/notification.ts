import {INotification, INotificationHandler, Mediator} from "mediatr-ts";
import {inject, injectable} from "inversify";
import {ListLocationHierarchy} from "./query.ts";

export class OrganizationStructureChanged implements INotification {
}

@injectable()
export class Handler implements INotificationHandler<OrganizationStructureChanged> {
    constructor(@inject(Mediator) private mediator: Mediator) {
    }
    async handle(_: OrganizationStructureChanged): Promise<void> {
        return this.mediator.send(new ListLocationHierarchy());
    }
}