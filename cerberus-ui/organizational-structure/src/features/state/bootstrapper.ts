import {Container, inject, injectable} from "inversify";
import {INotificationHandler, Mediator} from "mediatr-ts";
import {OrganizationStructureChanged, Handler} from "./notification.ts";
import {injectReducer, registerCommandHandler, registerNotificationHandler} from "@cerberus/core";
import {locationHierarchySlice} from "./reducer.ts";
import {ListLocationHierarchy, ListLocationHierarchyHandler} from "./query.ts";
import {UserAuthenticated} from "@cerberus/core/src/auth/notifications.ts";

@injectable()
class ListLocationsOnUserAuthenticatedHandler implements INotificationHandler<UserAuthenticated> {
    constructor(@inject(Mediator)private mediator: Mediator) {
    }
    async handle(_: UserAuthenticated): Promise<void> {
        await this.mediator.send(new ListLocationHierarchy());
    }
}
const requestHandlers =[
    {command: ListLocationHierarchy, handler: ListLocationHierarchyHandler}
]
const notificationHandlers = [
    {notification: UserAuthenticated, handler: ListLocationsOnUserAuthenticatedHandler},
    {notification: OrganizationStructureChanged, handler: Handler}
]

export const bootstrapOrganizationStructureState = (container: Container) => {
    injectReducer('locationHierarchy', locationHierarchySlice.reducer);
    for (let i = 0; i < notificationHandlers.length; i++) {
        const {notification, handler} = notificationHandlers[i];
        registerNotificationHandler(notification, handler);
    }
    for (let i = 0; i < requestHandlers.length; i++) {
        const {command, handler} = requestHandlers[i];
        registerCommandHandler(command, handler);
    }
    return Promise.resolve(container);
};